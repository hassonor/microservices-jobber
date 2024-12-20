FROM jenkins/ssh-agent:jdk17

USER root

# Install necessary packages
RUN apt-get update && \
    apt-get install -y docker.io passwd curl && \
    gpasswd -a jenkins docker && \
    service docker start

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    chmod +x kubectl && \
    mkdir -p /home/jenkins/.local/bin && \
    mv ./kubectl /home/jenkins/.local/bin/kubectl

# Expose SSH port
EXPOSE 22

# Entrypoint to start the SSH daemon
ENTRYPOINT ["/usr/sbin/sshd", "-D"]
