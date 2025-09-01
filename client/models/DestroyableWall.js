export default class DestroyableWall {
    #id = null;
    #hp = 100;

    constructor(id) {
        this.#id = id;
    }

    get hp() {
        return this.#hp;
    }

    set hp(hp) {
        this.#hp = hp;
    }
}
