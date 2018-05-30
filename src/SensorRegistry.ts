import { HTTP_CONFIGURATION } from "./http-common";

export class SensorRegistryRequester {
    
    public request() {
        return HTTP_CONFIGURATION.get('sensor-registry/') //TODO remove slash
        .then(response => {
            // JSON responses are automatically parsed.
            //console.log(response.data);
            return SensorRegistry.parse(<JsonSensor> response.data)
        })
        .catch(e => {
            console.error(e)
            return new SensorRegistry(new MachineSensor(""))
        });

    }

}

export class SensorRegistry {
    
    constructor(readonly topLevelSensor: Sensor) {}

    public static parse(sensor: JsonSensor) : SensorRegistry {
        return new SensorRegistry(this.parseSensor(sensor))
    }

    public toJson(pretty?: boolean) {
        return JSON.stringify(this.topLevelSensor, (key, val) => key != "parent" ? val : undefined, pretty ? '\t' : undefined)
    }

    public toPrettyJson() {
        return this.toJson(true)
    }

    private static parseSensor(sensor: JsonSensor) : Sensor {
        if (sensor.children) {
            let children = sensor.children.map(child => this.parseSensor(child))
            let parsedSensor = new AggregatedSensor(sensor.identifier, children)
            children.forEach(child => child.parent = parsedSensor)
            return parsedSensor
        } else {
            return new MachineSensor(sensor.identifier)
        }
    }

    public static flatCopy(sensorRegistry: SensorRegistry): SensorRegistry {
        return new SensorRegistry(this.flatCopySensor(sensorRegistry.topLevelSensor))
    }

    private static flatCopySensor(sensor: Sensor): Sensor {
        if (sensor instanceof AggregatedSensor) {
            let children = sensor.children.map(child => this.flatCopySensor(child))
            return new AggregatedSensor(sensor.identifier, children)
        } else {
            return new MachineSensor(sensor.identifier)
        }
    }

}

export type Sensor = AggregatedSensor | MachineSensor;

export class AggregatedSensor {

    constructor(readonly identifier: string, readonly children: Array<Sensor>) {}

    public parent?: AggregatedSensor //TODO make nicer

}

export class MachineSensor {
    
    constructor(readonly identifier: string) {}

    parent?: AggregatedSensor //TODO make nicer

}

export interface JsonSensor {
    identifier: string
    children?: Array<JsonSensor>
}