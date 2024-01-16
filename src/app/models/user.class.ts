export class User {
    firstName: string;
    email: string;
    picture: string;
    location: string;
    firstInterval: number;
    secondInterval: number;
    firstPreInterval: number;
    secondPreInterval: number;

    constructor(obj?: any) {
        this.firstName = obj && obj.firstName ? obj.firstName : '';
        this.email = obj && obj.email ? obj.email : '';
        this.picture = obj && obj.picture ? obj.picture : '';
        this.location = obj && obj.location ? obj.location : '';
        this.firstInterval = obj && obj.firstInterval ? obj.firstInterval : '';
        this.secondInterval = obj && obj.secondInterval ? obj.secondInterval : '';
        this.firstPreInterval = obj && obj.firstPreInterval ? obj.firstPreInterval : '';
        this.secondPreInterval = obj && obj.secondPreInterval ? obj.secondPreInterval : '';
    }

    public toJson() {
        return {
            firstName: this.firstName,
            email: this.email,
            picture: this.picture,
            location: this.location,
            firstInterval: this.firstInterval,
            secondInterval: this.secondInterval,
            firstPreInterval: this.firstPreInterval,
            secondPreInterval: this.secondPreInterval,
        }
    }
}