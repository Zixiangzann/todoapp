import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button'
import { blueGrey, lightBlue } from '@mui/material/colors';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import NotesIcon from '@mui/icons-material/Notes';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { createTheme, styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import React, { useState, Component } from 'react';
import undoable from 'redux-undo'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  // backgroundColor: blueGrey.A700,
  textAlign: 'center',
  // color: teal[500],
  borderRadius: 0
}));

const Item2 = styled(Paper)(({ theme }) => ({
  // backgroundColor: blueGrey[100],
  textAlign: 'right',
  borderRadius: 0
}));

const itemSlice = createSlice({
  name: 'AddItem',
  initialState: {
    item: (window.localStorage.getItem("item") !== null) ? JSON.parse(window.localStorage.getItem("item")) : []
  },
  reducers: {
    addItem: (state, action) => {
      if (action.payload.trim() !== "") {
        state.item =
          [
            ...state.item,
            {
              id: Date.now() + Math.random(),
              label: action.payload,
              completed: false,
              lastUpdateDate: Date.now(),
              notes: "",
              dueDate: null,
              priority: "",
              showInput: false,
              // [...state.item, action.payload]  
            }
          ]
      }
    },
    storeLocalStorage: (state) => {
      window.localStorage.setItem("item", JSON.stringify(state.item))
    },
    removeItem: (state, action) => {
      state.item = [
        ...state.item
      ].filter((item) => item.id !== action.payload)
    },
    removeAll: (state) => {
      state.item = []
    },
    removeToDo: (state) => {
      state.item = [
        ...state.item
      ].filter((item) => item.completed === true);
    },
    removeCompleted: (state) => {
      state.item = [
        ...state.item
      ].filter((item) => item.completed === false)
    },
    changeCompletionStatus: (state, action) => {
      state.item.map((item) => {
        if (item.id === action.payload) {
          item.completed = !item.completed
          item.lastUpdateDate = Date.now()
        }
      });
      state.item = [...state.item]
    },
    changeTextField: (state, action) => {
      state.item.map((item) => {
        if (item.id === action.payload.id) {
          item.notes = action.payload.notes
        }
      })
      state.item = [
        ...state.item
      ]
    },
    changePriority: (state, action) => {
      state.item.map((item) => {
        if (item.id === action.payload.id) {
          item.priority = action.payload.priority
        }
      })
      state.item = [
        ...state.item
      ]
    },
    changeDueDate: (state, action) => {
      state.item.map((item) => {
        if (item.id === action.payload.id) {
          item.dueDate = action.payload.dueDate
        }
      })
      state.item = [
        ...state.item
      ]
    },
    showAdditonalInput: (state, action) => {
      state.item.map((item) => {
        if (item.id === action.payload) {
          item.showInput = !item.showInput
        } else {
          //to only show 1 additonal input at 1 time. finding a better way to implement this whole function... 
          item.showInput = false
        }
      })
      state.item = [
        ...state.item
      ]
    }
  }
}
)


export const { addItem, storeLocalStorage, removeItem, removeAll, changeCompletionStatus, removeToDo, removeCompleted, changeTextField, changePriority, changeDueDate, showAdditonalInput } = itemSlice.actions;
export const addItemReducer = itemSlice.reducer;

export const store = configureStore({
  reducer: {
    // addItem: addItemReducer
    addItem: undoable(addItemReducer)
  }
})

// SUBSCRIBE
const CompletedItem = () => {
  const dispatch = useDispatch();
  const completedItems = useSelector((state) => state.addItem.present.item).filter((item) => item.completed === true)

  return (
    <Item sx={{ paddingTop: "4px", minHeight: "600px", maxHeight: "800px", width: "350px", overflow: "auto", whiteSpace: "nowrap" }}>
      <div className="Completed">
        <Typography variant="h4" fontFamily="Apple Color Emoji" color={lightBlue[50]} backgroundColor={blueGrey[400]}>Completed
          <Tooltip title="Remove Completed">
            <IconButton
              alt="Clear all completed list"
              onClick={() => {
                dispatch(removeCompleted())
                dispatch(storeLocalStorage())
              }}
              sx={{ marginLeft: "5px", color: "lightcoral" }}
            >
              <DeleteIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          </Tooltip>
        </Typography>

        <List sx={{ width: '100%', maxWidth: 360 }}>

          {completedItems.sort((a, b) => (a.lastUpdateDate) - (b.lastUpdateDate)).map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;
            return (
              <ListItem
                key={item.id}
                secondaryAction={

                  <Tooltip title="Delete Task">
                    <IconButton
                      edge="end"
                      alt=">Delete Task"
                      onClick={() => {
                        dispatch(removeItem(item.id))
                        dispatch(storeLocalStorage())
                      }}
                      sx={{ marginLeft: "5px", color: "lightcoral" }}
                    >
                      <CancelIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                  </Tooltip>

                }
                sx={{ flexWrap: "wrap" }}
                disablePadding
              >
                <ListItemButton dense>

                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={item.completed}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      onClick={() => {
                        dispatch(changeCompletionStatus(item.id));
                        dispatch(storeLocalStorage())
                      }}
                    />
                  </ListItemIcon>
                  {/* <ListItemText id={labelId} primary={item.label}/> */}
                  <Typography id={labelId} whiteSpace="normal"
                    onClick={() => {
                      dispatch(showAdditonalInput(item.id))
                      dispatch(storeLocalStorage())
                    }}
                    sx={{ wordWrap: 'break-word', width: '11rem' }}>{item.label}</Typography>
                </ListItemButton>
                {item.showInput === true ?
                  <Box sx={{ backgroundColor: 'whitesmoke', width: "inherit" }}>

                    <TextField
                      id="standard-multiline-flexible"
                      label="Notes"
                      multiline
                      minRows={4}
                      maxRows={8}
                      value={item.notes}
                      sx={{ width: "inherit" }}
                      onChange={(e) => {
                        dispatch(changeTextField({
                          id: item.id,
                          notes: e.target.value
                        }))
                        dispatch(storeLocalStorage())
                      }
                      }
                    />


                    <Box sx={{ paddingTop: "1rem" }}>
                      <Typography id="duedate">Due Date</Typography>
                      <Button variant="text" onClick={(e) => {
                        dispatch(changeDueDate({
                          id: item.id,
                          dueDate: Date.now()
                        }))
                        dispatch(storeLocalStorage())
                      }
                      }
                      >Today</Button>
                      <Button variant="text" onClick={(e) => {
                        const date = new Date();
                        let tomorrow = date.setDate(date.getDate() + 1);
                        dispatch(changeDueDate({
                          id: item.id,
                          dueDate: tomorrow
                        }))
                        dispatch(storeLocalStorage())
                      }
                      }>Tomorrow</Button>
                    </Box>

                    <Box sx={{ paddingTop: "0.3rem" }}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          // label="datepicker"
                          value={item.dueDate}
                          onChange={(e) => {
                            dispatch(changeDueDate({
                              id: item.id,
                              dueDate: e.valueOf()
                            }))
                            dispatch(storeLocalStorage())
                            console.log(e.valueOf())
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Box>

                    <Box sx={{ paddingTop: "1rem" }}>
                      <InputLabel id="priority-select-label" sx={{ paddingTop: "0rem" }}>Priority</InputLabel>
                      <Select
                        labelId="priority-select"
                        id="priority-select"
                        sx={{ width: "50%" }}
                        value={item.priority}
                        label="Priority"
                        onChange={(e) => {
                          dispatch(changePriority({
                            id: item.id,
                            priority: e.target.value
                          }))
                          dispatch(storeLocalStorage())
                        }}
                      >
                        <MenuItem value={3}>High</MenuItem>
                        <MenuItem value={2}>Medium</MenuItem>
                        <MenuItem value={1}>Low</MenuItem>
                        <MenuItem value={0}>None</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  : null}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Item>
  )
}


const ToDoItem = () => {
  const dispatch = useDispatch();
  const todoItems = useSelector((state) => state.addItem.present.item).filter((item) => item.completed === false)
  // const [showAdditonalInput, setShowAdditonalInput] = useState(true);

  return (

    <Item sx={{ paddingTop: "4px", minHeight: "600px", maxHeight: "800px", width: "350px", overflow: "auto", whiteSpace: "nowrap" }}>
      <div className="ToDo">
        <Typography variant="h4" fontFamily="Apple Color Emoji" color={lightBlue[50]} backgroundColor={blueGrey[400]}>TO DO
          <Tooltip title="Remove TO DO">
            <IconButton
              alt="Clear all to do list"
              onClick={() => {
                dispatch(removeToDo())
                dispatch(storeLocalStorage())
              }}
              sx={{ marginLeft: "5px", color: "lightcoral" }}
            >
              <DeleteIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          </Tooltip>
        </Typography>

        <List sx={{ width: '100%', maxWidth: 360 }}>
          {todoItems.sort((a, b) => (a.lastUpdateDate) - (b.lastUpdateDate)).map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;
            return (
              <ListItem
                key={item.id}
                secondaryAction={

                  <Tooltip title="Delete Task">
                    <IconButton
                      edge="end"
                      alt=">Delete Task"
                      onClick={() => {
                        dispatch(removeItem(item.id))
                        dispatch(storeLocalStorage())

                      }}
                      sx={{ marginLeft: "5px", color: "lightcoral" }}
                    >
                      <CancelIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                  </Tooltip>

                }
                sx={{ flexWrap: "wrap" }}
                disablePadding
              >
                <ListItemButton dense>

                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={item.completed}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      onClick={() => {
                        dispatch(changeCompletionStatus(item.id));
                        dispatch(storeLocalStorage())
                      }}
                    />

                  </ListItemIcon>

                  <Typography id={labelId} whiteSpace="normal"
                    onClick={() => {
                      dispatch(showAdditonalInput(item.id))
                      dispatch(storeLocalStorage())
                    }}
                    sx={{ wordWrap: 'break-word', width: '11rem' }}>{item.label}</Typography>
                </ListItemButton>
                {item.showInput === true ?
                  <Box sx={{ backgroundColor: 'whitesmoke', width: "inherit" }}>

                    <TextField
                      id="standard-multiline-flexible"
                      label="Notes"
                      multiline
                      minRows={4}
                      maxRows={8}
                      value={item.notes}
                      sx={{ width: "inherit" }}
                      onChange={(e) => {
                        dispatch(changeTextField({
                          id: item.id,
                          notes: e.target.value
                        }))
                        dispatch(storeLocalStorage())
                      }
                      }
                    />


                    <Box sx={{ paddingTop: "1rem" }}>
                      <Typography id="duedate">Due Date</Typography>
                      <Button variant="text" onClick={(e) => {
                        dispatch(changeDueDate({
                          id: item.id,
                          dueDate: Date.now()
                        }))
                        dispatch(storeLocalStorage())
                      }
                      }
                      >Today</Button>
                      <Button variant="text" onClick={(e) => {
                        const date = new Date();
                        let tomorrow = date.setDate(date.getDate() + 1);
                        dispatch(changeDueDate({
                          id: item.id,
                          dueDate: tomorrow
                        }))
                        dispatch(storeLocalStorage())
                      }
                      }>Tomorrow</Button>
                    </Box>

                    <Box sx={{ paddingTop: "0.3rem" }}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          // label="datepicker"
                          value={item.dueDate}
                          onChange={(e) => {
                            dispatch(changeDueDate({
                              id: item.id,
                              dueDate: e.valueOf()
                            }))
                            dispatch(storeLocalStorage())
                            console.log(e.valueOf())
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Box>

                    <Box sx={{ paddingTop: "1rem" }}>
                      <InputLabel id="priority-select-label" sx={{ paddingTop: "0rem" }}>Priority</InputLabel>
                      <Select
                        labelId="priority-select"
                        id="priority-select"
                        sx={{ width: "50%" }}
                        value={item.priority}
                        label="Priority"
                        onChange={(e) => {
                          dispatch(changePriority({
                            id: item.id,
                            priority: e.target.value
                          }))
                          dispatch(storeLocalStorage())
                        }}
                      >
                        <MenuItem value={3}>High</MenuItem>
                        <MenuItem value={2}>Medium</MenuItem>
                        <MenuItem value={1}>Low</MenuItem>
                        <MenuItem value={0}>None</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  : null}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Item>
  )
}

let textLength = 0;
const AddItem = () => {
  const [inputValue, setInputValue] = useState();
  const dispatch = useDispatch();
  const textInput = React.useRef(null);

  function getTextLength(e) {
    // console.log(e.target.value.length);
    textLength = e.target.value.length;
    return textLength;
  }

  return (
    <>
      <Item2 sx={{ alignSelf: "flex-end", backgroundColor: lightBlue[50] }}>

        <FormControl size="small" variant="standard">

          {textLength >= 50 ? <InputLabel error htmlFor="add-task">Max length: 50</InputLabel> :
            <InputLabel htmlFor="add-task">Add Task</InputLabel>
          }

          <Input inputProps={{ maxLength: 50 }} id="add-task"
            inputRef={textInput}
            onChange={(e) => {
              setInputValue(e.target.value);
              getTextLength(e);
            }
            }
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                dispatch(addItem(inputValue))
                dispatch(storeLocalStorage())
                textLength = 0;
                textInput.current.value = "";
                setInputValue("");
              }
            }
            }

          />

        </FormControl>
      </Item2>

      <Tooltip title="Add Task">
        <IconButton
          type="submit"
          alt="Add task"
          disabled={textLength === 0 ? true : false}
          onClick={(e) => {
            dispatch(addItem(inputValue))
            dispatch(storeLocalStorage())
            textLength = 0;
            textInput.current.value = "";
            setInputValue("");

          }
          }
          sx={{ marginLeft: "5px", color: lightBlue[200] }}
        >
          <AddCircleIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Tooltip>

    </>
  )
}

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <Box sx={{ paddingTop: "0.5rem" }}>
    <>
      <Button variant="outlined" startIcon={<UndoIcon />}
        onClick={onUndo} disabled={!canUndo}>
        Undo
      </Button>

      <Button variant="outlined" startIcon={<RedoIcon />}
        onClick={onRedo} disabled={!canRedo}>
        Redo
      </Button>
    </>
  </Box>

)

const mapStateToProps = state => {
  return {
    canUndo: state.addItem.past.length > 0,
    canRedo: state.addItem.future.length > 0
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUndo: () => {
      dispatch(UndoActionCreators.undo())
      dispatch(storeLocalStorage());
    },
    onRedo: () => {
      dispatch(UndoActionCreators.redo())
      dispatch(storeLocalStorage());
    }
  }
}

UndoRedo = connect(mapStateToProps, mapDispatchToProps)(UndoRedo)

const App = () => {

  return (
    <Container maxWidth="md" sx={{ backgroundColor: "grey", border: "3px solid lightblue", borderRadius: "12px" }}>
      <div className="App">
        <Stack
          direction="column"
          spacing={3}
          justifyContent="flex-end"
        >
          <Item>
            <Typography variant="h3" fontFamily="Apple Color Emoji" color={lightBlue[50]} backgroundColor={blueGrey[400]}
              sx={{ textAlign: "center", textDecoration: "underline" }}>TODOs
            </Typography>
          </Item>
        </Stack>

        <Stack
          direction="row"
          spacing={0}
          justifyContent="flex-end"
          paddingTop="7px"
          paddingRight="25px"
          paddingBottom="7px"
          backgroundColor={blueGrey[300]}
        >
          <AddItem />
        </Stack>

        <Stack
          direction="row"
          spacing={0}
          justifyContent="space-around"
          backgroundColor={blueGrey[50]}
          flexWrap="wrap"
        >
          <ToDoItem />
          <CompletedItem />
        </Stack>

        <UndoRedo />

      </div>
    </Container>
  )

}

export default App;
