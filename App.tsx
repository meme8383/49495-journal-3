import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = 'todos:v1';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (!json) return;
        const parsed: Todo[] = JSON.parse(json);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      } catch {}
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const persist = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch {}
    };
    persist();
  }, [todos]);

  const remainingCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  const addTodo = useCallback(() => {
    const trimmed = newTodoText.trim();
    if (!trimmed) return;
    const next: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos(current => [next, ...current]);
    setNewTodoText('');
  }, [newTodoText]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(current => current.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(current => current.filter(t => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(current => current.filter(t => !t.completed));
  }, []);

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoRow}>
      <Pressable style={styles.checkbox} onPress={() => toggleTodo(item.id)}>
        <View style={[styles.checkboxInner, item.completed && styles.checkboxInnerChecked]} />
      </Pressable>
      <Pressable style={styles.todoTextWrapper} onPress={() => toggleTodo(item.id)}>
        <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]} numberOfLines={2}>
          {item.text}
        </Text>
      </Pressable>
      <Pressable style={styles.deleteBtn} onPress={() => deleteTodo(item.id)} accessibilityLabel="Delete">
        <Text style={styles.deleteBtnText}>✕</Text>
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined, default: undefined })}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>To‑Do</Text>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add a task"
            value={newTodoText}
            onChangeText={setNewTodoText}
            onSubmitEditing={addTodo}
            returnKeyType="done"
            style={styles.input}
          />
          <Pressable style={[styles.primaryBtn, !newTodoText.trim() && styles.primaryBtnDisabled]} onPress={addTodo}>
            <Text style={styles.primaryBtnText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{remainingCount} remaining</Text>
          <Pressable onPress={clearCompleted}>
            <Text style={styles.linkText}>Clear completed</Text>
          </Pressable>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  inner: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 8,
  },
  primaryBtn: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaText: {
    color: '#4b5563',
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  checkboxInnerChecked: {
    backgroundColor: '#2563eb',
  },
  todoTextWrapper: {
    flex: 1,
  },
  todoText: {
    color: '#111827',
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  deleteBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteBtnText: {
    fontSize: 18,
    color: '#ef4444',
  },
});
