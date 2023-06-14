export class Seminar {
    time: string;
    room: string;
    onlineUrl: string;
    talks: Talk[];
    indexNumber: number;

    constructor(indexNumber: number = 0, time: string = new Date().toISOString(), talks: Talk[] = [], room: string = "4070", onlineUrl: string = "") {
        this.indexNumber = indexNumber;
        this.time = time;
        this.talks = talks;
        while (this.talks.length < 0) {
            this.talks.push(new Talk());
        }
        this.room = room;
        this.onlineUrl = onlineUrl;
    }

    static fromObject(obj: Object): Seminar {
        const x = new Seminar();
        Object.assign(x, obj);
        x.talks = x.talks.map(talk => Talk.fromObject(talk));
        return x;
    }

    date(): Date {
        return new Date(this.time);
    }

    realTalks(): Talk[] {
        return this.talks.filter(talk => talk.isReal());
    }

    allAuthors(): Author[] {
        return this.realTalks().flatMap(talk => talk.realAuthors());
    }

    targetFilename(): string {
        return this.allAuthors().map(author => author.filenameSlug()).join("_") + ".html";
    }

    cumulativeTitle(): string {
        return this.realTalks().map(talk => talk.title).join(". ");
    }

    bgColor(): string {
        const ff = parseInt("ff", 16), ee = parseInt("ee", 16);
        const g = (ff - this.indexNumber).toString(16), b = (ee + this.indexNumber).toString(16);
        return `#ee${g}${b}`;
    }
}

export class Talk {
    authors: Author[];
    title: string;
    description: string;
    citations: Citation[];
    uncollapsed: boolean;

    constructor(title: string = "", authors: Author[] = [], description: string = "", citations: Citation[] = []) {
        this.title = title;
        this.authors = authors;
        while (this.authors.length < 5) {
            this.authors.push(new Author());
        }
        this.description = description;
        this.citations = citations;
        while (this.citations.length < 10) {
            this.citations.push(new Citation());
        }
        this.uncollapsed = true;
    }

    static fromObject(obj: Object): Talk {
        const x = new Talk();
        Object.assign(x, obj);
        x.authors = x.authors.map(author => Author.fromObject(author));
        x.citations = x.citations.map(citation => Citation.fromObject(citation));
        return x;
    }

    isReal(): boolean {
        return this.title.length > 0;
    }

    realAuthors(): Author[] {
        return this.authors.filter(author => author.isReal());
    }

    realCitations(): Citation[] {
        return this.citations.filter(citation => citation.isReal());
    }
}

export class Author {
    firstName: string;
    lastName: string;

    constructor(firstName: string = "", lastName: string = "") {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    static fromObject(obj: Object): Author {
        const x = new Author();
        Object.assign(x, obj);
        return x;
    }

    isReal(): boolean {
        return this.firstName.length > 0 || this.lastName.length > 0;
    }

    toString(): string {
        return [this.firstName, this.lastName].filter(s => s.length > 0).join(" ");
    }

    filenameSlug(): string {
        const firstInitial = slug(this.firstName.toLowerCase().slice(0, 1));
        const lastSlug = slug(this.lastName.toLowerCase());
        return `${firstInitial}${lastSlug}`;
    }
}

export class Citation {
    title: string;
    url?: string;

    constructor(title: string = "", url: string = "") {
        this.title = title;
        this.url = url;
    }

    static fromObject(obj: Object): Citation {
        const x = new Citation();
        Object.assign(x, obj);
        return x;
    }

    isReal(): boolean {
        return this.title.length > 0 || this.url.length > 0;
    }
}

function slug(s: string): string {
    // thanks https://stackoverflow.com/a/37511463
    return s.normalize("NFD").replace(/[^a-z]/gu, "");
}
