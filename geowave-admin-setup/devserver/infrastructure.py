#!/usr/bin/env python3

import base64
import io
import os
import tarfile
import textwrap

from troposphere import Base64, GetAtt, Output, Parameter, Ref, Sub, Tags, Template
from troposphere import ec2
from troposphere import elasticloadbalancingv2 as elb
from troposphere import route53


RESOURCE_DIR  = os.path.join(os.path.dirname(__file__), 'resources')


PARAMS = [
    Parameter(
        'allowedIp',
        Type='String',
        AllowedPattern=r'^\d+\.\d+\.\d+\.\d+$',
    ),
    Parameter(
        'amiId',
        Type='AWS::EC2::Image::Id',
        Default='ami-f973ab84',
    ),
    Parameter(
        'certificateArn',
        Type='String',
        Default='arn:aws:acm:us-east-1:611363247110:certificate/0d9e584e-853d-45c5-93c8-fdd717e08ed4',
    ),
    Parameter(
        'cidrVpc',
        Type='String',
        Default='10.0.0.0/16',
    ),
    Parameter(
        'cidrSubnetA',
        Type='String',
        Default='10.0.1.0/24',
    ),
    Parameter(
        'cidrSubnetB',
        Type='String',
        Default='10.0.2.0/24',
    ),
    Parameter(
        'domain',
        Type='String',
        Default='geowave-leone-tempdev.net',
    ),
    Parameter(
        'subdomain',
        Type='String',
        Default='admin-ui.geowave-leone-tempdev.net',
    ),
    Parameter(
        'keypair',
        Type='AWS::EC2::KeyPair::KeyName',
        Default='gwa-dev',
    ),
]


def main():
    t = Template('GeoWave Admin UI dev server')

    t.add_parameter(PARAMS)

    t.add_resource(create_dnsrecords())
    t.add_resource(create_loadbalancer())
    t.add_resource(create_instance())
    t.add_resource(create_routing())
    t.add_resource(create_securitygroups())
    t.add_resource(create_subnets())
    t.add_resource(create_vpc())

    t.add_output(Output('application', Value=_subdomain_for_application()))
    t.add_output(Output('instance', Value=_subdomain_for_instance()))
    t.add_output(Output('jenkins', Value=_subdomain_for_jenkins()))
    t.add_output(Output('loadbalancer', Value=GetAtt('tlsFrontend', 'DNSName')))

    print(t.to_yaml())


def create_dnsrecords():
    return route53.RecordSetGroup(
        'dns',
        HostedZoneName=Sub('${domain}.'),
        RecordSets=[
            route53.RecordSet(
                'dnsInstance',
                Name=_subdomain_for_instance(),
                ResourceRecords=[GetAtt('devserver', 'PublicIp')],
                Type='A',
                TTL=300,
            ),
            route53.RecordSet(
                'dnsTlsApplication',
                Name=_subdomain_for_application(),
                Type='A',
                AliasTarget=route53.AliasTarget(
                    DNSName=GetAtt('tlsFrontend', 'DNSName'),
                    HostedZoneId=GetAtt('tlsFrontend', 'CanonicalHostedZoneID'),
                ),
            ),
            route53.RecordSet(
                'dnsTlsJenkins',
                Name=_subdomain_for_jenkins(),
                Type='A',
                AliasTarget=route53.AliasTarget(
                    DNSName=GetAtt('tlsFrontend', 'DNSName'),
                    HostedZoneId=GetAtt('tlsFrontend', 'CanonicalHostedZoneID'),
                ),
            ),
        ],
    )


def create_instance():
    return ec2.Instance(
        'devserver',
        BlockDeviceMappings=[
            ec2.BlockDeviceMapping(
                DeviceName='/dev/xvda',
                Ebs=ec2.EBSBlockDevice(
                    VolumeSize=100,
                    VolumeType='gp2',
                    DeleteOnTermination=True,
                ),
            ),
        ],
        ImageId=Ref('amiId'),
        InstanceType='t2.medium',
        KeyName=Ref('keypair'),
        SecurityGroupIds=[Ref('secgrpDevServer')],
        SubnetId=Ref('subnetA'),
        Tags=_tags(),
        UserData=Base64(textwrap.dedent(r'''
            #!/bin/bash -ex

            exec > >(tee ~/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
            echo BEGIN
            date '+%Y-%m-%d %H:%M:%S'

            # --- System Config
            hostnamectl set-hostname gwa-dev
            yum install -y git jq tree vim

            # --- UX
            cat <<-EOT > /etc/profile.d/ux.sh
                alias vi='vim'
                alias tree='tree -C'
            EOT
            cat <<-EOT >> /etc/vimrc
                set autoindent
                set modeline
                set tabstop=4
                set listchars=tab:——
            EOT

            # --- Docker
            yum install -y docker
            systemctl enable docker
            systemctl start docker

            usermod -aG docker ec2-user

            docker network create geowave-admin

            # --- Jenkins
            sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
            sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
            yum install -y jenkins java-1.8.0-openjdk

            usermod -aG docker jenkins

            systemctl enable jenkins
            systemctl start jenkins

            echo END
            date '+%Y-%m-%d %H:%M:%S'
        ''').lstrip()),
    )


def create_loadbalancer():
    return [
        elb.LoadBalancer(
            'tlsFrontend',
            SecurityGroups=[Ref('secgrpLoadBalancer')],
            Subnets=[Ref('subnetA'), Ref('subnetB')],
            Tags=_tags(),
        ),

        elb.Listener(
            'tlsFrontendListener',
            Certificates=[
                elb.Certificate(CertificateArn=Ref('certificateArn')),
            ],
            DefaultActions=[
                elb.Action(TargetGroupArn=Ref('tlsFrontendApplication'), Type='forward'),
            ],
            LoadBalancerArn=Ref('tlsFrontend'),
            Port=443,
            Protocol='HTTPS',
        ),

        elb.ListenerRule(
            'tlsFrontendJenkinsRule',
            Actions=[
                elb.Action(TargetGroupArn=Ref('tlsFrontendJenkins'), Type='forward'),
            ],
            Conditions=[
                elb.Condition(Field='host-header', Values=[_subdomain_for_jenkins()]),
            ],
            ListenerArn=Ref('tlsFrontendListener'),
            Priority=1,
        ),

        elb.TargetGroup(
            'tlsFrontendApplication',
            HealthCheckIntervalSeconds=300,
            HealthCheckPath='/health',
            Port=80,
            Protocol='HTTP',
            Tags=_tags(),
            Targets=[
                elb.TargetDescription(Id=Ref('devserver'), Port=80),
            ],
            VpcId=Ref('vpc'),
        ),
        elb.TargetGroup(
            'tlsFrontendJenkins',
            HealthCheckIntervalSeconds=300,
            HealthCheckPath='/robots.txt',
            Port=8080,
            Protocol='HTTP',
            Tags=_tags(),
            Targets=[
                elb.TargetDescription(Id=Ref('devserver'), Port=8080),
            ],
            VpcId=Ref('vpc'),
        ),
    ]


def create_routing():
    return [
        ec2.InternetGateway(
            'internetGateway',
            Tags=_tags(),
        ),
        ec2.VPCGatewayAttachment(
            'vpcToInternetGateway',
            InternetGatewayId=Ref('internetGateway'),
            VpcId=Ref('vpc'),
        ),
        ec2.RouteTable(
            'routeTable',
            VpcId=Ref('vpc'),
            Tags=_tags(),
        ),
        ec2.Route(
            'routeToInternetGateway',
            DestinationCidrBlock='0.0.0.0/0',
            GatewayId=Ref('internetGateway'),
            RouteTableId=Ref('routeTable'),
        ),
    ]


def create_securitygroups():
    return [
        ec2.SecurityGroup(
            'secgrpDevServer',
            GroupDescription='GeoWave Admin UI devserver',
            SecurityGroupIngress=[
                ec2.SecurityGroupRule(
                    CidrIp=Sub('${allowedIp}/32'),
                    Description='Shell Access',
                    FromPort=22,
                    ToPort=22,
                    IpProtocol='TCP',
                ),
                ec2.SecurityGroupRule(
                    CidrIp=Ref('cidrVpc'),
                    Description='Internal ELB traffic to application',
                    FromPort=80,
                    ToPort=80,
                    IpProtocol='TCP',
                ),
                ec2.SecurityGroupRule(
                    CidrIp=Ref('cidrVpc'),
                    Description='Internal ELB traffic to Jenkins',
                    FromPort=8080,
                    ToPort=8080,
                    IpProtocol='TCP',
                ),
            ],
            Tags=_tags(),
            VpcId=Ref('vpc'),
        ),
        ec2.SecurityGroup(
            'secgrpLoadBalancer',
            GroupDescription='GeoWave Admin UI devserver TLS-frontend',
            SecurityGroupIngress=[
                ec2.SecurityGroupRule(
                    CidrIp='0.0.0.0/0',
                    Description='External HTTPS traffic',
                    FromPort=443,
                    ToPort=443,
                    IpProtocol='TCP',
                ),
            ],
            Tags=_tags(),
            VpcId=Ref('vpc'),
        ),
    ]


def create_subnets():
    return [
        ec2.Subnet(
            'subnetA',
            AvailabilityZone='us-east-1a',
            CidrBlock=Ref('cidrSubnetA'),
            MapPublicIpOnLaunch=True,
            Tags=_tags(),
            VpcId=Ref('vpc'),
        ),
        ec2.SubnetRouteTableAssociation(
            'subnetAToRouteTable',
            RouteTableId=Ref('routeTable'),
            SubnetId=Ref('subnetA'),
        ),
        ec2.Subnet(
            'subnetB',
            AvailabilityZone='us-east-1b',
            CidrBlock=Ref('cidrSubnetB'),
            MapPublicIpOnLaunch=True,
            Tags=_tags(),
            VpcId=Ref('vpc'),
        ),
        ec2.SubnetRouteTableAssociation(
            'subnetBToRouteTable',
            RouteTableId=Ref('routeTable'),
            SubnetId=Ref('subnetB'),
        ),
    ]


def _encoded_resourcebundle(name='resource_bundle'):
    buf = io.BytesIO()

    with tarfile.open(fileobj=buf, mode='w:gz') as f:
        f.add(RESOURCE_DIR, name)

    buf.seek(0)
    return base64.b64encode(buf.read()).decode()


def _subdomain_for_application():
    return Sub('${subdomain}')


def _subdomain_for_instance():
    return Sub('sys.${subdomain}')


def _subdomain_for_jenkins():
    return Sub('jenkins.${subdomain}')


def _tags():
    return Tags(
        Name='admin-ui',
        Description='GeoWave Admin UI dev server component',
        POC='david.bazile@radiantsolutions.com',
    )


def create_vpc():
    return ec2.VPC(
        'vpc',
        CidrBlock=Ref('cidrVpc'),
        EnableDnsSupport=True,
        EnableDnsHostnames=True,
        Tags=_tags(),
    )


if __name__ == '__main__':
    main()
