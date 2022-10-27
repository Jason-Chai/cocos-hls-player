declare type Options = {
    videoDOM: HTMLVideoElement;
    videoURL: {
        '1080': string;
        '720': string;
    };
    timeUpdate: Function;
};
export declare function createHlsVideo(options: Options): any;
export {};
