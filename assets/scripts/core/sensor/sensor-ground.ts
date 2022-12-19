import { _decorator, Component, Collider, ICollisionEvent, geometry, Node, PhysicsSystem, Vec3, v3, Color } from 'cc';
import { Actor } from '../../logic/actor/actor';
import { SubstanceCore } from '../../logic/item/substance-core';
import { Gizmo, u3 } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('SensorGround')
export class SensorGround extends Component {

    _collider: Collider | undefined | null;
    _actor: Actor | undefined | null;
    _isGround = false;
    _ray: geometry.Ray = new geometry.Ray();
    _velocity:Vec3 = v3(0, 0, 0);

    @property([Vec3])
    original = []

    @property
    maskNum = 4;

    start () {

        this._collider = this.getComponent(Collider);
        this._ray.d.x = 0;
        this._ray.d.y = -1;
        this._ray.d.z = 0;
        this._actor = this.node.parent?.getComponent(Actor);
    }

    /*
    onCollisionEnter (event: ICollisionEvent) {
        if (this._isGround) return;
        if (event.otherCollider.node.layer === 1 << 2) {
            this._actor!.onGround();
            this._isGround = true;
        }
    }

    onCollisionExit (event: ICollisionEvent) {
        if (!this._isGround) return;
        if (event.otherCollider.node.layer === 1 << 2) {
            this._actor!.offGround();
            this._isGround = false;
        }
    }
    */

    update (deltaTime: number) {
        this.checkGroundRays();
    }

    /*
    checkGroundOneRay() {
        const mask = (1 << this.maskNum);
        u3.c(this._ray.o, this.node.worldPosition);
        if (PhysicsSystem.instance.raycastClosest(this._ray, mask, 0.3)) {
            if (!this._isGround) {
                this._isGround = true;
                this._actor!.onGround();
            }
        } else {
            if (this._isGround) {
                this._isGround = false;
                this._actor!.offGround();
            }
        }
    }
    */

    checkGroundRays() {

        this._actor!._rigid.getLinearVelocity(this._velocity);
        if (this._velocity.y > 0) return;
        //this._isGround = this._actor?._data.is_ground;
        const mask = (1 << this.maskNum);
        for(let i = 0; i < this.original.length; i++) {
            u3.c(this._ray.o, this.node.worldPosition);
            let o = this.original[i];
            this._ray.o.x = o.x;
            this._ray.o.z = o.z;
            if (PhysicsSystem.instance.raycastClosest(this._ray, mask, 0.1)) {
                const res = PhysicsSystem.instance.raycastClosestResult;
                this._actor!._data.walk_in_type = SubstanceCore.Instance.checkNodeType(res.collider.node);
                if (!this._isGround) {
                    this._isGround = true;
                    this._actor!.onGround();
                }
                return;
            }
        }

        if (this._isGround) {
            this._isGround = false;
            this._actor!.offGround();
        }

    }

}