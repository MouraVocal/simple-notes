import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  useEffect(() => {
    const getNotes = async () => {
      try {
        const notes = await AsyncStorage.getItem("notes");
        if (notes !== null) {
          setNotes(JSON.parse(notes));
        }
      } catch (e: any) {
        throw new Error(e.message);
      }
    };

    getNotes();
  }, []);

  interface INote {
    id: number;
    title: string;
    note: string;
  }

  const [notes, setNotes] = useState<INote[]>([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const saveNote = async () => {
    if (title.trim() === "" || note.trim() === "") {
      return;
    }

    const newNote: INote = {
      id: Math.floor(Math.random() * 1000),
      title,
      note,
    };

    setNotes([...notes, newNote]);
    setTitle("");
    setNote("");

    try {
      await AsyncStorage.setItem("notes", JSON.stringify([...notes, newNote]));
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Criar anotação</Text>
      <Text style={styles.title}>Título</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={{ height: 40 }}
          onChangeText={(value) => setTitle(value)}
          value={title}
        />
      </View>
      <Text style={styles.title}>Anotação</Text>
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          textAlignVertical="top"
          style={{ height: 100 }}
          onChangeText={(value) => setNote(value)}
          value={note}
        />
      </View>
      <Pressable
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#23fe23",
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
        onPress={saveNote}
      >
        <Text>Salvar</Text>
      </Pressable>
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <View style={styles.noteContainer}>
            <Text>{item.title}</Text>
            <Text>{item.note}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
  },
  viewPort: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    padding: 10,
    borderRadius: 5,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  noteContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#721010",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#deadad",
  },
});
