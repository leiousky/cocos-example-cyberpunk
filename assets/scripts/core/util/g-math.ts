import { lerp, Vec2, Vec3 } from "cc";

export class GMath {

    public static uuid () {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

    }

    // Clamps value between min and max and returns value.
    // Set the position of the transform to be that of the time
    // but never less than 1 or more than 3
    //
    public static clamp (value: number, min: number, max: number): number {
        if (value < min)
            value = min;
        else if (value > max)
            value = max;
        return value;
    }

    // Gradually changes a value towards a desired goal over time.
    public static smoothDamp (current: number, target: number, currentVelocity: number, smoothTime: number, deltaTime: number): [number, number] {

        var maxSpeed = Number.POSITIVE_INFINITY;
        // Based on Game Programming Gems 4 Chapter 1.10
        smoothTime = Math.max(0.0001, smoothTime);
        var omega = 2 / smoothTime;
        var x = omega * deltaTime;
        var exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        var change = current - target;
        var originalTo = target;

        // Clamp maximum speed
        var maxChange = maxSpeed * smoothTime;
        change = GMath.clamp(change, -maxChange, maxChange);
        target = current - change;

        var temp = (currentVelocity + omega * change) * deltaTime;
        currentVelocity = (currentVelocity - omega * temp) * exp;
        var output = target + (change + temp) * exp;

        // Prevent overshooting
        if (originalTo - current > 0 === output > originalTo) {
            output = originalTo;
            currentVelocity = (output - originalTo) / deltaTime;
        }

        return [output, currentVelocity];
    }

    static lerpSmooth (value: number, target: number, rate: number, dt: number) {
        return lerp(target, value, Math.exp(-rate * dt))
    }

    static range(max:number, min:number, value:number) {
        if(value > max) return max;
        if(value < min) return min;
        return value;
    }

}

export class GVec3 {

    public static smoothDamp (current: Vec3, target: Vec3, currentVelocity: Vec3, smoothTime: number, deltaTime: number) {

        var x = GMath.smoothDamp(current.x, target.x, currentVelocity.x, smoothTime, deltaTime);
        var y = GMath.smoothDamp(current.y, target.y, currentVelocity.y, smoothTime, deltaTime);
        var z = GMath.smoothDamp(current.z, target.z, currentVelocity.z, smoothTime, deltaTime);

        current.x = x[0];
        current.y = y[0];
        current.z = z[0];

        target.x = x[1];
        target.y = y[1];
        target.z = z[1];

    }

    static lerpSmooth (value: Vec3, target: Vec3, rate: number, dt: number) {
        value.x = GMath.lerpSmooth(target.x, value.x, rate, dt)
        value.y = GMath.lerpSmooth(target.y, value.y, rate, dt)
        value.z = GMath.lerpSmooth(target.z, value.z, rate, dt)

        return value;
    }
}