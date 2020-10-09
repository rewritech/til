// npx ts-node index.ts
let val1: number = 1
val1 = 10

const val2: number = 2
val2 = 20  // error

let val3 = 3  // set number automatically 

let a1: any = 1
let b1: any = []
let c1: any = a1 + b1

let a2 = 1
let b2 = []
let c2 = a2 + b2

let x: unknown  // 잘 안 씀
x = 3
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