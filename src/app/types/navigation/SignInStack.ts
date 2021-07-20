export type SignInNavigationParams = {
	Login: undefined;
	Signup: {
		name: string | null;
		email: string;
		profilePic: string | null;
	};
};
