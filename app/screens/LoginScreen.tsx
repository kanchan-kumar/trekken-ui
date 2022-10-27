import {observer} from "mobx-react-lite"
import React, {FC, useEffect, useMemo, useRef, useState} from "react"
import {TextInput, TextStyle, View, ViewStyle} from "react-native"
import {Icon, Button, Screen, Text, TextField, TextFieldAccessoryProps} from "../components"
import {useStores} from "../models"
import {AppStackScreenProps} from "../navigators"
import {colors, spacing} from "../theme"
import {Center, NativeBaseProvider, Stack} from "native-base";
import {Ionicons} from "@expo/vector-icons";
import sizes from "native-base/src/theme/base/sizes";
import {Button as NButton} from "native-base";
import {Icon as NIcon} from "native-base";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {
}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
    const authPasswordInput = useRef<TextInput>()
    const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [attemptsCount, setAttemptsCount] = useState(0)
    const {
        authenticationStore: {
            authEmail,
            authPassword,
            setAuthEmail,
            setAuthPassword,
            setAuthToken,
            validationErrors,
        },
    } = useStores()

    useEffect(() => {
        // Here is where you could fetch credientials from keychain or storage
        // and pre-fill the form fields.
        setAuthEmail("admin@abc.com")
        setAuthPassword("admin2022")
    }, [])

    const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

    function login() {
        setIsSubmitted(true)
        setAttemptsCount(attemptsCount + 1)

        if (Object.values(validationErrors).some((v) => !!v)) return

        // Make a request to your server to get an authentication token.
        // If successful, reset the fields and set the token.
        setIsSubmitted(false)
        setAuthPassword("")
        setAuthEmail("")

        // We'll mock this with a fake token.
        setAuthToken(String(Date.now()))
    }

    const PasswordRightAccessory = useMemo(
        () =>
            function PasswordRightAccessory(props: TextFieldAccessoryProps) {
                return (
                    <Icon
                        icon={isAuthPasswordHidden ? "view" : "hidden"}
                        color={colors.palette.neutral800}
                        containerStyle={props.style}
                        onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
                    />
                )
            },
        [isAuthPasswordHidden],
    )

    useEffect(() => {
        return () => {
            setAuthPassword("")
            setAuthEmail("")
        }
    }, [])

    return (
        <NativeBaseProvider>
            <Screen
                preset="auto"
                contentContainerStyle={$screenContentContainer}
                safeAreaEdges={["top", "bottom"]}
            >
                <View style={$header}>
                    <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn}/>
                </View>

                <Center flex={1} px="3">
                    <Stack direction={{
                        base: "row",
                        md: "row"
                    }} space={4}>
                        <NButton leftIcon={<NIcon as={Ionicons} name="md-logo-google" size="sm"/>}>
                            Google
                        </NButton>
                        <NButton endIcon={<NIcon as={Ionicons} name="md-logo-facebook" size="sm"/>}>
                            Facebook
                        </NButton>
                    </Stack>
                </Center>

                <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails}/>
                {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint}/>}
                <TextField
                    value={authEmail}
                    onChangeText={setAuthEmail}
                    containerStyle={$textField}
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    labelTx="loginScreen.emailFieldLabel"
                    placeholderTx="loginScreen.emailFieldPlaceholder"
                    helper={errors?.authEmail}
                    status={errors?.authEmail ? "error" : undefined}
                    onSubmitEditing={() => authPasswordInput.current?.focus()}
                />

                <TextField
                    ref={authPasswordInput}
                    value={authPassword}
                    onChangeText={setAuthPassword}
                    containerStyle={$textField}
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect={false}
                    secureTextEntry={isAuthPasswordHidden}
                    labelTx="loginScreen.passwordFieldLabel"
                    placeholderTx="loginScreen.passwordFieldPlaceholder"
                    helper={errors?.authPassword}
                    status={errors?.authPassword ? "error" : undefined}
                    onSubmitEditing={login}
                    RightAccessory={PasswordRightAccessory}
                />

                <Button
                    testID="login-button"
                    tx="loginScreen.tapToSignIn"
                    style={$tapButton}
                    preset="reversed"
                    onPress={login}
                />
            </Screen>
        </NativeBaseProvider>
    )
})

const $header: ViewStyle = {flex: 1, justifyContent: "center", alignItems: "center"}

const $screenContentContainer: ViewStyle = {
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
    flex: 1, justifyContent: "center", alignItems: "center"
}

const $enterDetails: TextStyle = {
    marginBottom: spacing.large,
}

const $hint: TextStyle = {
    color: colors.tint,
    marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
    marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
    marginTop: spacing.extraSmall,
}

// @demo remove-file
