export default class AudioService {
    #sounds = {};
    #volume = 0.5;
    #muted = false;

    constructor() {
        this.preloadSounds();
    }

    preloadSounds() {
        const soundFiles = {
            shoot: '/sounds/shoot.mp3',
            powerup: '/sounds/powerup.mp3',
            win: '/sounds/win.mp3',
            start: '/sounds/start.mp3',
            end: '/sounds/end.mp3',
            death: '/sounds/death.mp3',
            kill: '/sounds/kill.mp3',
        };

        for (const [name, path] of Object.entries(soundFiles)) {
            this.#sounds[name] = new Audio(path);
            this.#sounds[name].volume = this.#volume;
            this.#sounds[name].preload = 'auto';

            this.#sounds[name].addEventListener('error', (e) => {
                console.warn(`Failed to load sound: ${name} from ${path}`);
            });
        }
    }

    playSound(soundName, options = {}) {
        if (this.#muted) return;

        const sound = this.#sounds[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }

        const audioClone = sound.cloneNode();

        if (options.volume !== undefined) {
            audioClone.volume = Math.max(0, Math.min(1, options.volume));
        } else {
            audioClone.volume = this.#volume;
        }

        if (options.playbackRate !== undefined) {
            audioClone.playbackRate = options.playbackRate;
        }

        audioClone.play().catch(error => {
            console.warn(`Failed to play sound ${soundName}:`, error);
        });

        audioClone.addEventListener('ended', () => {
            audioClone.remove();
        });

        return audioClone;
    }

    playShoot(options = {}) { //
        this.playSound('shoot', options);
    }

    playPowerup(options = {}) { //
        this.playSound('powerup', options);
    }

    playDeath(options = {}) { //
        this.playSound('death', options);
    }

    playKill(options = {}) { //
        this.playSound('kill', options);
    }

    playWin(options = {}) { //
        this.playSound('win', options);
    }

    playStart(options = {}) { //
        this.playSound('start', options);
    }

    playEnd(options = {}) { //
        this.playSound('end', options);
    }
}
