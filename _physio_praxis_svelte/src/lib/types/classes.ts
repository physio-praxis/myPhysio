import type { IHeadTags, IOpenGraphTag, ITwitterCardTag } from './types';

export class HeadTags implements IHeadTags {
	title: string;
	description: string;
	viewport?: string | undefined;
	charset?: string | undefined;
	icon?: string | undefined;
	ogTag?: IOpenGraphTag | undefined;
	tcTag?: ITwitterCardTag | undefined;

	constructor(title: string, description: string) {
		this.title = title;
		this.description = description;
		this.viewport = 'width=device-width, initial-scale=1';
		this.charset = 'UTF-8';
		this.icon = '/favicon.png';
	}
}
