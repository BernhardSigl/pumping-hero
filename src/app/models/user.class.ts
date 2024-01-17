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
        this.firstInterval = obj && obj.firstInterval ? Number(obj.firstInterval) : 0;
        this.secondInterval = obj && obj.secondInterval ? Number(obj.secondInterval) : 0;
        this.firstPreInterval = obj && obj.firstPreInterval ? Number(obj.firstPreInterval) : 0;
        this.secondPreInterval = obj && obj.secondPreInterval ? Number(obj.secondPreInterval) : 0;
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