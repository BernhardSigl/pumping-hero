export class User {
    firstName: string;
    email: string;
    picture: string;
    location: string;
    exercises: { [key: string]: any };
    // min
    firstIntervalMin: number;
    secondIntervalMin: number;
    firstPreIntervalMin: number;
    secondPreIntervalMin: number;
    // sec
    firstIntervalSec: number;
    secondIntervalSec: number;
    firstPreIntervalSec: number;
    secondPreIntervalSec: number;

    constructor(obj?: any) {
        this.firstName = obj && obj.firstName ? obj.firstName : '';
        this.email = obj && obj.email ? obj.email : '';
        this.picture = obj && obj.picture ? obj.picture : '';
        this.location = obj && obj.location ? obj.location : '';
        this.exercises = obj && obj.exercises ? obj.exercises : [];
        // min
        this.firstIntervalMin = obj && obj.firstIntervalMin ? Number(obj.firstIntervalMin) : 0;
        this.secondIntervalMin = obj && obj.secondIntervalMin ? Number(obj.secondIntervalMin) : 0;
        this.firstPreIntervalMin = obj && obj.firstPreIntervalMin ? Number(obj.firstPreIntervalMin) : 0;
        this.secondPreIntervalMin = obj && obj.secondPreIntervalMin ? Number(obj.secondPreIntervalMin) : 0;
        // sec
        this.firstIntervalSec = obj && obj.firstIntervalSec ? Number(obj.firstIntervalSec) : 0;
        this.secondIntervalSec = obj && obj.secondIntervalSec ? Number(obj.secondIntervalSec) : 0;
        this.firstPreIntervalSec = obj && obj.firstPreIntervalSec ? Number(obj.firstPreIntervalSec) : 0;
        this.secondPreIntervalSec = obj && obj.secondPreIntervalSec ? Number(obj.secondPreIntervalSec) : 0;
    }

    public toJson() {
        return {
            firstName: this.firstName,
            email: this.email,
            picture: this.picture,
            location: this.location,
            exercises: this.exercises,
            // min
            firstIntervalMin: this.firstIntervalMin,
            secondIntervalMin: this.secondIntervalMin,
            firstPreIntervalMin: this.firstPreIntervalMin,
            secondPreIntervalMin: this.secondPreIntervalMin,
            // sec
            firstIntervalSec: this.firstIntervalSec,
            secondIntervalSec: this.secondIntervalSec,
            firstPreIntervalSec: this.firstPreIntervalSec,
            secondPreIntervalSec: this.secondPreIntervalSec,
        }
    }
}