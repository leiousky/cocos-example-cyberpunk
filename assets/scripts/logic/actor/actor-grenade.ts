import { _decorator, Component, Node, geometry, PhysicsSystem, v3 } from 'cc';
import { ActorEquipBase } from './actor-equip-base';
import { IActorEquip } from './actor-interface';
import { ActorPart } from './actor-part';
import { Res } from '../../core/res/res';
import { ResCache } from '../../core/res/res-cache';
import { ProjectileGrenade } from './projectile-grenade';
const { ccclass, property } = _decorator;

@ccclass('ActorGrenade')
export class ActorGrenade extends ActorEquipBase {

    onFire() {
        const forwardNode = this._actor!._forwardNode;
        const origin = forwardNode.worldPosition;
        const dir = forwardNode.forward;
        const prefab = ResCache.Instance.getPrefab(this._data.projectile_res);
        let position = v3(origin.x, origin.y, origin.z);
        position.add(dir);
        const projectile = Res.instNode(prefab, undefined, position);
        const projectileGrenade = projectile.getComponent(ProjectileGrenade);
        const throwDir = dir.multiplyScalar(10);
        console.log('--------- throw direction.', throwDir);
        projectileGrenade?.onThrow(this._data, throwDir);
    }

}

