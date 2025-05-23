const { createGroup, createQuest, getGroupQuests, getUserGroups, signUp } = require('./dist/index');

async function testBackend() {
  try {
    // Test authentication
    console.log('Testing authentication...');
    const userCredential = await signUp('test@example.com', 'password123');
    console.log('User created:', userCredential.user.uid);
    
    // Test group creation
    console.log('\nTesting group creation...');
    const groupId = await createGroup({
      name: 'Test Group',
      description: 'A test group',
      createdBy: userCredential.user.uid,
      members: [userCredential.user.uid]
    });
    console.log('Group created:', groupId);
    
    // Test quest creation
    console.log('\nTesting quest creation...');
    const questId = await createQuest({
      groupId,
      title: 'Test Quest',
      description: 'A test quest',
      createdBy: userCredential.user.uid,
      status: 'pending'
    });
    console.log('Quest created:', questId);
    
    // Test fetching data
    console.log('\nTesting data fetching...');
    const groups = await getUserGroups(userCredential.user.uid);
    console.log('User groups:', groups);
    
    const quests = await getGroupQuests(groupId);
    console.log('Group quests:', quests);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
testBackend(); 