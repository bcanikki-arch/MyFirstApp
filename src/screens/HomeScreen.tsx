import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }: any) {
  useEffect(() => {
    loadTasks();
  }, []);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const clearAllTasks = () => {
  Alert.alert(
    'Clear All Tasks',
    'Are you sure you want to delete all tasks?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          setTasks([]);
          setEditIndex(null);
          setTask('');
          await AsyncStorage.removeItem('TASKS');
        },
      },
    ]
  );
};


  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('TASKS');

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log('Error loading tasks');
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('TASKS', JSON.stringify(newTasks));
    } catch (error) {
      console.log('Error saving tasks');
    }
  };

  const isDark = useColorScheme() === 'dark';

  const [task, setTask] = useState('');
  type Task = {
    text: string;
    done: boolean;
  };

  const [tasks, setTasks] = useState<Task[]>([]);


  const addTask = () => {
    if (task.trim() === '') return;

    let newTasks = [...tasks];

    if (editIndex !== null) {
      newTasks[editIndex].text = task;
      setEditIndex(null);
    } else {
      newTasks.push({ text: task, done: false });
    }

    setTasks(newTasks);
    saveTasks(newTasks);
    setTask('');
  };




  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
    saveTasks(newTasks);
  };



  // Delete task
  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        To-Do App
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('About')}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>
            Go to About
        </Text>
        </TouchableOpacity>

      <TouchableOpacity style={styles.clearBtn} onPress={clearAllTasks}>
      <Text style={styles.clearText}>Clear All</Text>
    </TouchableOpacity>


      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Enter task..."
          placeholderTextColor={isDark ? '#aaa' : '#999'}
          value={task}
          onChangeText={setTask}
          style={[
            styles.input,
            {
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#555' : '#ccc',
            },
          ]}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addText}>
            {editIndex !== null ? '✓' : '+'}
          </Text>
        </TouchableOpacity>
      </View>


      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity
              onPress={() => toggleTask(index)}
              onLongPress={() => {
                setTask(item.text);
                setEditIndex(index);
              }}
            >
              <Text
                style={[
                  styles.taskText,
                  item.done && {
                    textDecorationLine: 'line-through',
                    color: 'gray',
                  },
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(index)}>
              <Text style={styles.delete}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
    borderRadius: 8,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  delete: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  clearBtn: {
  backgroundColor: 'red',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 6,
  alignSelf: 'center',
  marginBottom: 10,
},
clearText: {
  color: '#fff',
  fontWeight: 'bold',
},

});
