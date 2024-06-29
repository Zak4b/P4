import user from "./dist/actions/user.js";

const [node, _, ...users] = process.argv;
for (let i = 1; i < users.length; i++) {
	try {
		user.merge(users[0], users[i]);
	} catch (error) {
		console.error(`! Impossible de merge #${users[0]} et #${users[i]}`);
	}
}
