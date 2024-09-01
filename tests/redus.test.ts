
import { SelectionStrategy, SortStrategy, LeaderBoardData, UserJson, User, AppState } from "@/redux/types";
import {userReducer, loadInitialState} from "../redux/reducer"
import { setSorting, setSelection } from "@/redux/actions";
import { memoizedLeaderBoardUsers, selectSelectionStrategy, selectSortingStrategy } from "@/redux/selectors";
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

let TOP_TEN = [
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

let BOTTOM_TEN = [
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

describe('load initial state', () => {
    // given 
    const data = TEST_DATA;

    // when
    let state = loadInitialState(data);

    // then
    it(`should default to sort strategy ${SortStrategy[SortStrategy.BY_RANK]}`, () =>{
        expect(selectSelectionStrategy(state)).toEqual(SortStrategy.BY_RANK)
    })

    it(`should default to selection strategy ${SelectionStrategy[SelectionStrategy.TOP_TEN]}`, () =>{
        expect(selectSelectionStrategy(state)).toEqual(SelectionStrategy.TOP_TEN)
    })
})

describe('select leaderboard (exact match)', () => {

    let state : AppState;

    beforeEach(()=>{
        const data = TEST_DATA;
        state = loadInitialState(data);
    })


    it(`should return empty array without search`, () =>{
        let searchQuery = null;
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        expect(leaderBoard).toHaveLength(0);
    });

    it(`should return empty array when searched user does not exist`, () =>{
        let searchQuery = "does_not_exist";
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        expect(leaderBoard).toHaveLength(0);
    });

    it(`should return top 10 with selected user when searched is in top ten`, () =>{
        // given
        let searchQuery = "rank_1";
        let expectedLeaderBoard = TOP_TEN.map(user => ({user, selected: false}))
        expectedLeaderBoard[0].selected = true;

        expectedLeaderBoard.sort((a, b) => a.user)

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toHaveLength(10);
        expect(leaderBoard).toEqual(expectedLeaderBoard);
    });

    it(`should return top 10 sorted by name when sort strategy is ${SortStrategy[SortStrategy.BY_NAME]}`, () =>{
        // given
        let searchQuery = "rank_2";
        let expectedLeaderBoard = TOP_TEN.map(user => ({user, selected: false}))
        expectedLeaderBoard[1].selected = true;

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toHaveLength(10);
        expect(leaderBoard).toEqual(expectedLeaderBoard);
    });

    it(`should return top 10 with 10th user being searched user when user is not in top ten`, () =>{
        // given
        let searchQuery = "rank_11";
        
        let rank11User = {user: BOTTOM_TEN[9], selected: true};
        let expectedLeaderBoard = TOP_TEN.map(user => ({user, selected: false}));
        expectedLeaderBoard[9] = rank11User;

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toHaveLength(10);
        expect(leaderBoard).toEqual(expectedLeaderBoard);
    });

    it(`should return bottom 10 with selected user when searched is in bottom ten`, () =>{
        // given
        let searchQuery = "rank_2";

        let expectedLeaderBoard = BOTTOM_TEN.map(user => ({user, selected: false}))
        expectedLeaderBoard[0].selected = true;

        state.selection = SelectionStrategy.BOTTOM_TEN;

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toHaveLength(10);
        expect(leaderBoard).toEqual(expectedLeaderBoard);
    });

   
    it(`should return bottom 10 with 1st user being searched user when user is not in bottom ten`, () =>{
        // given
        let searchQuery = "rank_1";

        let rank1User = {user: TOP_TEN[0], selected: true};
        let expectedLeaderBoard = BOTTOM_TEN.map(user => ({user, selected: false}));
        expectedLeaderBoard[0] = rank1User;

        state.selection = SelectionStrategy.BOTTOM_TEN;

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toHaveLength(10);
        expect(leaderBoard).toEqual(expectedLeaderBoard);
    });
   
})

describe('select leaderboard (fuzzy search)', () => {

    let state : AppState;

    beforeEach(()=>{
        const data = TEST_DATA;
        state = loadInitialState(data);
        state.selection = SelectionStrategy.FUZZY;
    })

    it(`should return all users when fuzzy search with empty filter`, () =>{
        // given
        let searchQuery = "~";
    
        let rank11User = {user:  BOTTOM_TEN[9], selected: false};
        let expectedLeaderBoard = TOP_TEN.map(user => ({user, selected: false}));
        expectedLeaderBoard.push(rank11User);

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toEqual(expectedLeaderBoard);
    });

    it(`should return only users with names matching filter when fuzzy search with non-empty filter`, () =>{
        // given
        let searchQuery = "~1";
    
        let rank1User = {user: TOP_TEN[0], selected: false};
        let rank10User = {user: TOP_TEN[9], selected: false};
        let rank11User = {user: BOTTOM_TEN[9], selected: false};
        let expectedLeaderBoard = [rank1User, rank10User ,rank11User]

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toEqual(expectedLeaderBoard);
    });

    it(`should return empty array when no user bane matches fuzzy search with non-empty filter`, () =>{
        // given
        let searchQuery = "~does_not_exist";

        // when
        const leaderBoard = memoizedLeaderBoardUsers(state)(searchQuery)

        // then
        expect(leaderBoard).toHaveLength(0);
    });

});

