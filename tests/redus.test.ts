
import { SelectionStrategy, SortStrategy, LeaderBoardData, UserJson, User } from "@/redux/types";
import {userReducer, loadInitialState} from "../redux/reducer"
import { setSorting, setSelection } from "@/redux/actions";
import { selectSelectionStrategy, selectSortingStrategy } from "@/redux/selectors";
import { createUser, createUserData as createUserJsonData } from "./test.helpers";


const SORT_STRATEGIES = Object.keys(SortStrategy).filter((v) =>  isNaN(Number(v)))
const SELECTION_STRATEGY = Object.keys(SelectionStrategy).filter((v) => isNaN(Number(v)))

let TEST_DATA : LeaderBoardData  = {
    "1" : createUserJsonData("rank_1", 10),
    "2" : createUserJsonData("rank_2", 9),
    "3" : createUserJsonData("rank_3", 8),
    "4" : createUserJsonData("rank_4", 7),
    "5" : createUserJsonData("rank_5", 6),
    "6" : createUserJsonData("rank_6", 5),
    "7" : createUserJsonData("rank_7", 4),
    "8" : createUserJsonData("rank_8", 3),
    "9" : createUserJsonData("rank_9", 2),
    "10" : createUserJsonData("rank_10", 1),
    "11" : createUserJsonData("rank_11", 0),
}

describe('sort strategy reducer set action', () => {
    SORT_STRATEGIES
        .map(s => SortStrategy[s as keyof typeof SortStrategy])
        .forEach(sortStrategy => {
            it(`should set strategy to ${SortStrategy[sortStrategy]}`, () =>{
                let action =setSorting(sortStrategy)
                let state = userReducer(undefined, action);
  
                expect(selectSortingStrategy(state)).toBe(sortStrategy);
            })
    })
})

describe('selection strategy reducer set action', () => {
    SELECTION_STRATEGY
        .map(s => SelectionStrategy[s as keyof typeof SelectionStrategy])
        .forEach(selectionStrategy => {
            it(`should set strategy to ${SelectionStrategy[selectionStrategy]}`, () =>{
                let action = setSelection(selectionStrategy)
                let state = userReducer(undefined, action);
               
                expect(selectSelectionStrategy(state)).toBe(selectionStrategy);

        })
    })
})


// could leave this test as it feels too coupled to implementation 
// and instead test only the leader board select
describe('load initial state', () => {
    // given 
    const data = TEST_DATA;

    // when
    let state = loadInitialState(data);

    // then
    it(`should precompute top ten`, () =>{
        let expected : User[] = [
            createUser("rank_1", 1, 10),
            createUser("rank_2", 2, 9),
            createUser("rank_3", 3, 8),
            createUser("rank_4", 4, 7),
            createUser("rank_5", 5, 6),
            createUser("rank_6", 6, 5),
            createUser("rank_7", 7, 4),
            createUser("rank_8", 8, 3),
            createUser("rank_9", 9, 2),
            createUser("rank_10", 10, 1),
        ]

        expect(state.top10).toEqual(expected)
    })

    it(`should precompute bottom ten`, () =>{
        let expected : User[] = [
            createUser("rank_2", 2, 9),
            createUser("rank_3", 3, 8),
            createUser("rank_4", 4, 7),
            createUser("rank_5", 5, 6),
            createUser("rank_6", 6, 5),
            createUser("rank_7", 7, 4),
            createUser("rank_8", 8, 3),
            createUser("rank_9", 9, 2),
            createUser("rank_10", 10, 1),
            createUser("rank_11", 11, 0),
        ]
    
        expect(state.bottom10).toEqual(expected)
    })
   
})

