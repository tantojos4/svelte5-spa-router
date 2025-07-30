<script lang="ts">
	import { routeParams, goto } from '../../lib/routers.js';

	let { params = {} } = $props();

	// Get user ID from route parameters
	const userId: string = $derived(params.id || $routeParams.id);

	// Sample user data
	type User = {
		name: string;
		email: string;
		bio: string;
		joinDate: string;
		avatar: string;
	};

	const users: { [key: string]: User } = {
		'123': {
			name: 'John Doe',
			email: 'john@example.com',
			bio: 'Full-stack developer passionate about Svelte and modern web technologies.',
			joinDate: '2023-05-15',
			avatar: '👨‍💻'
		},
		'456': {
			name: 'Jane Smith',
			email: 'jane@example.com',
			bio: 'UI/UX designer and frontend developer. Loves creating beautiful user experiences.',
			joinDate: '2023-08-22',
			avatar: '👩‍🎨'
		},
		'789': {
			name: 'Bob Wilson',
			email: 'bob@example.com',
			bio: 'Backend engineer specializing in Node.js and database optimization.',
			joinDate: '2023-03-10',
			avatar: '👨‍🔧'
		}
	};

	const user = $derived(
		users[userId] || {
			name: 'Unknown User',
			email: 'unknown@example.com',
			bio: `User with ID "${userId}" not found. This demonstrates how the router handles dynamic parameters even when the data doesn't exist.`,
			joinDate: 'N/A',
			avatar: '❓'
		}
	);

	function editProfile() {
		goto(`/user/${userId}/edit`);
	}

	function viewSettings() {
		goto(`/user/${userId}/settings`);
	}

	function goToRandomUser() {
		const randomId = Math.floor(Math.random() * 1000);
		goto(`/user/${randomId}`);
	}
</script>

<div class="user-profile">
	<header class="profile-header">
		<div class="avatar">{user.avatar}</div>
		<div class="user-info">
			<h1>{user.name}</h1>
			<p class="email">{user.email}</p>
			<p class="user-id">User ID: <code>{userId}</code></p>
		</div>
	</header>

	<div class="profile-content">
		<section class="bio-section">
			<h2>About</h2>
			<p>{user.bio}</p>
		</section>

		<section class="details-section">
			<h2>Details</h2>
			<div class="detail-grid">
				<div class="detail-item">
					<strong>Join Date:</strong>
					<span>{user.joinDate}</span>
				</div>
				<div class="detail-item">
					<strong>User ID:</strong>
					<span>{userId}</span>
				</div>
				<div class="detail-item">
					<strong>Profile Status:</strong>
					<span class="status">{users[userId] ? 'Active' : 'Not Found'}</span>
				</div>
			</div>
		</section>

		<section class="actions-section">
			<h2>Actions</h2>
			<div class="actions">
				<button onclick={editProfile}>Edit Profile</button>
				<button onclick={viewSettings}>View Settings</button>
				<button class="secondary" onclick={goToRandomUser}>Random User</button>
			</div>
		</section>

		<section class="debug-section">
			<h2>Debug Information</h2>
			<div class="debug-info">
				<p><strong>Route Parameters:</strong> {JSON.stringify(params)}</p>
				<p><strong>Store Parameters:</strong> {JSON.stringify($routeParams)}</p>
				<p><strong>Current User ID:</strong> {userId}</p>
				<p><strong>User Exists:</strong> {users[userId] ? 'Yes' : 'No'}</p>
			</div>
		</section>
	</div>
</div>

<style>
	.user-profile {
		padding: 2rem;
		max-width: 800px;
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.avatar {
		font-size: 4rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		width: 100px;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.user-info h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
	}

	.email {
		margin: 0 0 0.5rem 0;
		opacity: 0.9;
		font-size: 1.1rem;
	}

	.user-id {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.user-id code {
		background: rgba(255, 255, 255, 0.2);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.profile-content {
		display: grid;
		gap: 2rem;
	}

	section {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
	}

	section h2 {
		margin: 0 0 1rem 0;
		color: #2d3748;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.bio-section p {
		line-height: 1.6;
		color: #4a5568;
		margin: 0;
	}

	.detail-grid {
		display: grid;
		gap: 1rem;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: #f7fafc;
		border-radius: 6px;
	}

	.detail-item strong {
		color: #2d3748;
	}

	.status {
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	button {
		background: #007acc;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	button:hover {
		background: #005a99;
	}

	button.secondary {
		background: #718096;
	}

	button.secondary:hover {
		background: #4a5568;
	}

	.debug-info {
		background: #f7fafc;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		padding: 1rem;
		font-family: monospace;
		font-size: 0.9rem;
	}

	.debug-info p {
		margin: 0.5rem 0;
		word-break: break-all;
	}

	@media (max-width: 768px) {
		.user-profile {
			padding: 1rem;
		}

		.profile-header {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.actions {
			flex-direction: column;
		}

		.detail-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}

	/* Status colors */
	.status {
		background: #c6f6d5;
		color: #22543d;
	}
</style>
