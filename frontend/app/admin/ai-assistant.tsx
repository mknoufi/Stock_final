import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auroraTheme as _auroraTheme } from "@/theme/auroraTheme";
import { spacing, typography, layout as _layout } from "@/styles/globalStyles";
import { useTheme } from "@/hooks/useTheme";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
}

export default function AIAssistantScreen() {
    const theme = useTheme();
    const { user: _user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I am your Warehouse AI Assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"online" | "offline" | "checking">("checking");
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const response = await axios.get("/api/pi/status");
            setStatus(response.data.active ? "online" : "offline");
        } catch (_error) {
            setStatus("offline");
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputText.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            // Proxy request through our backend pi_api
            const response = await axios.post("/api/pi/chat", {
                messages: messages.concat(userMessage).map(m => ({
                    role: m.role,
                    content: m.content
                })),
                model: "gpt-4" // or any model supported by pi-server
            });

            const assistantContent = response.data.choices[0].message.content;

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: assistantContent,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (_error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "system",
                    content: "Sorry, I encountered an error connecting to the AI service. Please ensure the pi-server is running.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Stack.Screen
                options={{
                    title: "AI Assistant",
                    headerShown: true,
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.text,
                }}
            />

            {/* Status Header */}
            <View style={[styles.statusHeader, { borderBottomColor: theme.colors.border }]}>
                <View style={styles.statusRow}>
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: status === "online" ? "#4CAF50" : status === "offline" ? "#F44336" : "#FFC107" }
                        ]}
                    />
                    <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
                        AI Sidecar: {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                </View>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.messageList}
                contentContainerStyle={styles.messageListContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((item) => (
                    <View
                        key={item.id}
                        style={[
                            styles.messageContainer,
                            item.role === "user" ? styles.userMessage : styles.assistantMessage,
                            item.role === "system" && styles.systemMessage,
                        ]}
                    >
                        <View
                            style={[
                                styles.messageBubble,
                                {
                                    backgroundColor:
                                        item.role === "user"
                                            ? theme.colors.primary
                                            : item.role === "system"
                                                ? "rgba(244, 67, 54, 0.1)"
                                                : theme.colors.surface,
                                    borderWidth: item.role === "assistant" ? 1 : 0,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    {
                                        color: item.role === "user" ? "#FFFFFF" : theme.colors.text,
                                    },
                                ]}
                            >
                                {item.content}
                            </Text>
                        </View>
                        <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                ))}
                {isLoading && (
                    <View style={[styles.messageContainer, styles.assistantMessage]}>
                        <View style={[styles.messageBubble, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}
            >
                <TextInput
                    style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                    placeholder="Ask something..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleSend}
                    disabled={isLoading || !inputText.trim()}
                >
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusHeader: {
        padding: spacing.sm,
        borderBottomWidth: 1,
        alignItems: "center",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
    },
    messageList: {
        flex: 1,
    },
    messageListContent: {
        padding: spacing.md,
        gap: spacing.md,
    },
    messageContainer: {
        maxWidth: "85%",
    },
    userMessage: {
        alignSelf: "flex-end",
    },
    assistantMessage: {
        alignSelf: "flex-start",
    },
    systemMessage: {
        alignSelf: "center",
        maxWidth: "95%",
    },
    messageBubble: {
        padding: spacing.sm,
        borderRadius: 16,
        paddingHorizontal: spacing.md,
    },
    messageText: {
        ...typography.bodyMedium,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        marginHorizontal: 4,
    },
    inputContainer: {
        flexDirection: "row",
        padding: spacing.sm,
        paddingBottom: Platform.OS === "ios" ? spacing.xl : spacing.sm,
        borderTopWidth: 1,
        alignItems: "center",
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        minHeight: 40,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});
