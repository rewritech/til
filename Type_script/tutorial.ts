// typescript tutorial for introduction
// run cmd: npx ts-node tutorial.ts
let val1: number = 1
val1 = 10

const val2: number = 2
val2 = 20  // error: const can't change

let val3 = 3  // set number automatically 

let a1: any = 1
let b1: any = []
let c1: any = a1 + b1

let a2 = 1
let b2 = []
let c2 = a2 + b2  // error: different type

let x: unknown  // 잘 안 씀
x = 3
x += 10  // error: need to check with if
if (typeof x === 'number') {
    x += 10
}

let user: {
    id: number
    house?: boolean
    // [key: string]: string -> error above keys are string and other types
    [key: string]: string|number|boolean
} = {
    id: 1,
    house: true,
}
user['option'] = 'VIP'

let arr1 = [1, 'a', true]
let arr2: (string|number)[] = [1, 'a']  // if put true(boolean) is error

type User = {
    id: number
    name: string
}

let friend1: User = {
    id: 1,
    name: 'John',
}

let group1 = {
    id: 1,
    users: [{id: 1, name: 'a'}, {id: 2, name: 'b'}]
}

type group = {
    id: number
    users: User[]
}

let group2: group = {
    id: 2,
    users: [{id: 1, name: 'a'}, {id: 2, name: 'b'}, {id: 3, name: 'c'}]
}

type Staff = {
    rank: String
}

type extreme = User & Staff
type normal = User | Staff

// tuple
let tuple1: [number] = [1]
let tuple2: [number, string] = [1]  // error: short
let tuple3: [number] = [1, 2, 3, 4]  // error: long

let r_a: readonly number[] = [0, 1, 2]
a[0] = 3  // error: readonly can't change even inside of object


function add0(a: number, b: number) {  // return type automatically set
    return a + b
}

function add1(a: number, b: number): number {
    return a + b
}

function add2(a: number, b: number): string {
    return a + b  // error: need to return string
}

let add4 = (a: number, b: number) => a + b

let add5 = (a: number, b: number) => {
    let x = a + b
    return x
}

// type function
type Add_f = (a: number, b: number) => number
let add6: Add_f = (a, b) => a + b


// paramater
function fs(t: string, n = 'it', p?: boolean, ...arr:[]) {
    console.log(t, n, p, arr)
}


// Generic
type Filter1 = <T>(array: T[], f: (item: T) => boolean) => T[]

let filter1: Filter1 = (array, f) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (f(array[i])) {
            result.push(array[i])
        }
    }
    return result
}

let filter_result1 = filter1([1, 2, 3], n => n > 2)


// Generic scope: can set type
type Filter2<T> = (array: T[], f: (item: T) => boolean) => T[]

let filter2: Filter2<number> = (array, f) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (f(array[i])) {
            result.push(array[i])
        }
    }
    return result
}

let filter_result2 = filter2([1, 2, 3], n => n > 2)


// Generic multi type
type Filter3<T, U> = (array: T[], f: (item: T) => U) => T[]

let filter3: Filter3<number, boolean> = (array, f) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (f(array[i])) {
            result.push(array[i])
        }
    }
    return result
}

let filter_result3 = filter3([1, 2, 3], n => n > 2)


// Generic restrict (extends)
type Filter4<T extends number, U extends boolean> = (array: T[], f: (item: T) => U) => T[]

let filter4: Filter4<number, boolean> = (array, f) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (f(array[i])) {
            result.push(array[i])
        }
    }
    return result
}

let filter_result4 = filter4([1, 2, 3], n => n > 2)


// Generic default (=)
type Filter5<T, U extends string | boolean = boolean> = (array: T[], f: (item: T) => U) => T[]

let filter5: Filter5<number> = (array, f) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (f(array[i])) {
            result.push(array[i])
        }
    }
    return result
}

let filter_result5 = filter5([1, 2, 3], n => n > 2)


// object for most data type
type Filter6<T extends object> = (a: T) => T
let filter6_1: Filter6<number[]>
let filter6_2: Filter6<[string, number]> = (tu) => {
    let first = tu[0]
    let second = tu[1]
    let newFirst = first + String(second)
    let newSecond = first.length + second
    return [newFirst, newSecond]
}

let result_filter6_2 = filter6_2(['10', 0])


// Class
abstract class Character {
    protected abstract hp: number
    protected abstract name: string
    protected abstract str: number
    protected abstract def: number
 
    protected abstract attack(target: Player, dmg: number): void
    protected abstract defence(dmg: number): void
 }
 
 class Player extends Character {
   protected hp: number
   protected name: string
   protected str: number
   protected def: number
 
   constructor(hp: number, name: string, str: number, def: number) {
       super()
       this.hp = hp
       this.name = name
       this.str = str
       this.def = def
   }
 
   attack(target: Player, dmg: number) {
       target.defence(dmg)
   }
 
   defence(dmg: number) {
       const totalDmg = dmg - this.def
       this.hp -= totalDmg
       console.log(this.name, totalDmg, 'damaged!', 'remain hp : ', this.hp)
   }
 }
 
 class Wizard extends Player {
   private mp: number
   constructor(hp: number, name: string, str: number, def: number, mp: number) {
       super(hp, name, str, def)
       this.mp = mp
   }
 
   fireBall(target: Player) {
       const dmg = this.str * 5
       this.mp -= 20
       console.log(this.name, 'use Fire Ball!!', 'remain mp', this.mp)
       this.attack(target, dmg)
       console.log('=====================')
   }
 }
 
 class Warrior extends Player {
   private stamina: number
   constructor(hp: number, name: string, str: number, def: number, stamina: number) {
       super(hp, name, str, def)
       this.stamina = stamina
   }
//    constructor(
//        hp: number,
//        name: string,
//        str: number,
//        def: number,
//        private stamina: number  // 선언과 동시에 생성
//        ) {
//        super(hp, name, str, def)
//        this.stamina = stamina
//    }

whirlwind(target: Player) {
    const dmg = this.str * 0.7
    this.stamina -= 20
    console.log(this.name, 'use whrlwind!!', 'remain stamina', this.stamina)
    for (let i = 1; i < 9; i ++) {
        this.attack(target, dmg)
    }
    console.log('=====================')
}
}

let wizard: Wizard = new Wizard(100, 'wizard', 40, 10, 100)
let warrior: Warrior = new Warrior(300, 'warrior', 20, 30, 50)

wizard.fireBall(warrior)
warrior.whirlwind(wizard)

class Test1 {
    public a: number
    protected b: number  // callable subclass and inside of this
    private c: number  // callable only inside of this

    printNum() {
        console.log(this.b)
        console.log(this.c)
    }
}

let t1:Test1 = new Test1()
console.log(t1.a)
console.log(t1.b)  // eror
console.log(t1.c)  // eror


