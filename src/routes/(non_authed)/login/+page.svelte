<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import ErrorMessageBox from '$lib/components/layout/ErrorMessageBox.svelte';
	import type { IButton } from '$lib/components/interfaces/components/IButton';
	import type { ILinkButton } from '$lib/components/interfaces/components/ILinkButton';
	import type { ITextInput } from '$lib/components/interfaces/components/ITextInput';
	import type { IErrorMessageBox } from '$lib/components/interfaces/layout/IErrorMessageBox';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import FormCard from '$lib/components/layout/FormCard.svelte';
	import CenteredLayout from '$lib/components/layout/CenteredLayout.svelte';

	export let data: PageData;

	const { form, errors, enhance, message } = superForm(data.form, {
		clearOnSubmit: 'none',
		resetForm: false
	});

	const usernameInputProps: ITextInput = {
		name: 'username',
		label: 'Username',
		placeholder: 'Enter your username',
		required: true
	};

	const passwordInputProps: ITextInput = {
		name: 'password',
		label: 'Password',
		placeholder: 'Enter your password',
		type: 'password',
		required: false
	};

	const loginButtonProps: IButton = {
		id: 'login',
		label: 'Sign in',
		type: 'primary'
	};

	const registerLinkButtonProps: ILinkButton = {
		id: 'register-link-button',
		label: 'Wanna join? Sign up here!',
		href: '/register'
	};

	const errorMessageBoxProps: IErrorMessageBox = {
		id: 'error-message-box'
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<CenteredLayout>
	<FormCard title="Login" errorMessage={$message}>
		<form use:enhance method="post">
			<TextInput
				props={{ ...usernameInputProps, value: $form.username, errorMessage: $errors.username }}
				extraClasses="mb-4 w-full"
			/>
			<TextInput
				props={{ ...passwordInputProps, value: $form.password, errorMessage: $errors.password }}
				extraClasses="mb-8 w-full"
			/>
			<Button props={loginButtonProps} extraClasses="mb-4 w-full" />
		</form>

		<hr class="mb-4" />

		<LinkButton props={registerLinkButtonProps} extraClasses="mb-4" />
	</FormCard>
</CenteredLayout>
