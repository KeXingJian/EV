package com.kxj.ai.event;

import org.springframework.context.ApplicationEvent;

public class LimitReachedEvent extends ApplicationEvent {

    private final String interfacePath;

    public LimitReachedEvent(Object source, String interfacePath) {
        super(source);
        this.interfacePath = interfacePath;
    }

    public String getInterfacePath() {
        return interfacePath;
    }
}
