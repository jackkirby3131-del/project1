// Mock database for users (in production, use a real backend)
const users = {};
let currentUser = null;

// DOM Elements
const signupBtn = document.getElementById('signupBtn');
const authModal = document.getElementById('authModal');
const closeBtn = document.querySelector('.close-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const goalForm = document.getElementById('goalForm');
const loadingScreen = document.getElementById('loadingScreen');
const resultsSection = document.getElementById('resultsSection');
const restartBtn = document.getElementById('restartBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Form data storage
let formData = {
    zipcode: '',
    age: '',
    goal: ''
};

// Event Listeners
signupBtn.addEventListener('click', openAuthModal);
closeBtn.addEventListener('click', closeAuthModal);
window.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', switchTab);
});

signupForm.addEventListener('submit', handleSignup);
loginForm.addEventListener('submit', handleLogin);
restartBtn.addEventListener('click', restartProcess);
downloadBtn.addEventListener('click', downloadPlan);

// Modal Functions
function openAuthModal() {
    // First validate the form
    const zipcode = document.getElementById('zipcode').value;
    const age = document.getElementById('age').value;
    const goal = document.getElementById('goal').value;

    if (!zipcode || !age || !goal) {
        alert('Please fill in all fields before continuing');
        return;
    }

    // Store form data
    formData.zipcode = zipcode;
    formData.age = age;
    formData.goal = goal;

    authModal.classList.remove('hidden');
    resetAuthForms();
}

function closeAuthModal() {
    authModal.classList.add('hidden');
}

function switchTab(e) {
    const tabName = e.target.getAttribute('data-tab');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    e.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function resetAuthForms() {
    signupForm.reset();
    loginForm.reset();
}

// Authentication Functions
function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (users[email]) {
        alert('Email already registered. Please login instead.');
        return;
    }

    // Create new user
    users[email] = {
        email: email,
        password: password,
        createdAt: new Date()
    };

    currentUser = email;
    closeAuthModal();
    startLoadingSequence();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!users[email] || users[email].password !== password) {
        alert('Invalid email or password');
        return;
    }

    currentUser = email;
    closeAuthModal();
    startLoadingSequence();
}

// Loading Sequence
function startLoadingSequence() {
    // Hide form section
    document.getElementById('form-section').style.display = 'none';
    
    // Show loading screen
    loadingScreen.classList.remove('hidden');
    
    // Simulate plan generation
    const messages = [
        'Calculating the best route for your journey...',
        'Analyzing your goals and resources...',
        'Building your personalized flight plan...',
        'Finalizing your customized strategy...'
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (messageIndex < messages.length) {
            document.getElementById('loadingText').textContent = messages[messageIndex];
            messageIndex++;
        }
    }, 1500);

    // Generate plan after 5 seconds
    setTimeout(() => {
        clearInterval(messageInterval);
        generatePersonalizedPlan();
        loadingScreen.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 5000);
}

// Plan Generation Engine
function generatePersonalizedPlan() {
    const { zipcode, age, goal } = formData;

    // Display user info
    document.getElementById('resultZip').textContent = zipcode;
    document.getElementById('resultAge').textContent = age;
    document.getElementById('resultGoal').textContent = goal;

    // Generate personalized plan based on input
    const plan = createPlan(age, goal);
    
    const planContent = document.getElementById('planContent');
    planContent.innerHTML = plan;
}

function createPlan(age, goal) {
    const ageGroup = getAgeGroup(age);
    const goalLower = goal.toLowerCase();

    let plan = '';

    // Determine plan based on goal keywords
    if (goalLower.includes('career') || goalLower.includes('job') || goalLower.includes('work')) {
        plan = generateCareerPlan(ageGroup);
    } else if (goalLower.includes('fitness') || goalLower.includes('health') || goalLower.includes('weight')) {
        plan = generateFitnessPlan(ageGroup);
    } else if (goalLower.includes('education') || goalLower.includes('learn') || goalLower.includes('skill')) {
        plan = generateEducationPlan(ageGroup);
    } else if (goalLower.includes('financial') || goalLower.includes('money') || goalLower.includes('save')) {
        plan = generateFinancialPlan(ageGroup);
    } else if (goalLower.includes('travel') || goalLower.includes('adventure') || goalLower.includes('explore')) {
        plan = generateTravelPlan(ageGroup);
    } else {
        plan = generateGeneralPlan(ageGroup, goal);
    }

    return plan;
}

function getAgeGroup(age) {
    age = parseInt(age);
    if (age < 20) return 'teen';
    if (age < 30) return 'twenties';
    if (age < 40) return 'thirties';
    if (age < 50) return 'forties';
    return 'senior';
}

function generateCareerPlan(ageGroup) {
    const timelines = {
        teen: '3-5 years',
        twenties: '2-3 years',
        thirties: '1-2 years',
        forties: '6-12 months',
        senior: '3-6 months'
    };

    return `
        <h3>📈 Your Career Flight Plan</h3>
        <p>Your journey to career success is about to take off! Based on your profile, here's your personalized path:</p>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Timeline: ${timelines[ageGroup]}</h4>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Phase 1: Foundation (Month 1-2)</h4>
        <ul>
            <li>Identify your specific career target and required skills</li>
            <li>Research companies and roles that align with your goals</li>
            <li>Update your resume and LinkedIn profile</li>
            <li>Take relevant online courses or certifications</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Phase 2: Skill Development (Month 3-4)</h4>
        <ul>
            <li>Master key technical and soft skills</li>
            <li>Build a portfolio of projects or accomplishments</li>
            <li>Network with professionals in your target industry</li>
            <li>Practice interviewing and communication skills</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Phase 3: Action (Month 5+)</h4>
        <ul>
            <li>Apply strategically to 5-10 positions per week</li>
            <li>Leverage your network for referrals</li>
            <li>Prepare thoroughly for each interview</li>
            <li>Negotiate your best offer</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">🎯 Success Metrics</h4>
        <p><strong>✓ Short-term (30 days):</strong> Complete 2 relevant certifications, update all social profiles</p>
        <p><strong>✓ Mid-term (90 days):</strong> Land 3+ interviews, expand professional network by 20+ connections</p>
        <p><strong>✓ Long-term:</strong> Secure your dream role with competitive compensation</p>
    `;
}

function generateFitnessPlan(ageGroup) {
    const workoutDays = ageGroup === 'teen' ? 5 : ageGroup === 'senior' ? 3 : 4;

    return `
        <h3>💪 Your Fitness Flight Plan</h3>
        <p>Your health transformation journey begins now! Here's your customized fitness roadmap:</p>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Timeline: 12 Weeks to Transformation</h4>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Week 1-4: Build the Foundation</h4>
        <ul>
            <li>Establish a consistent workout routine (${workoutDays} days/week)</li>
            <li>Focus on form and technique over intensity</li>
            <li>Include cardio (30 min) and strength training (30 min)</li>
            <li>Adjust diet: increase protein, reduce processed foods</li>
            <li>Stay hydrated: 8+ glasses of water daily</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Week 5-8: Accelerate Progress</h4>
        <ul>
            <li>Increase workout intensity and duration</li>
            <li>Add functional training and flexibility work</li>
            <li>Track your food intake for 1 week</li>
            <li>Include meal planning and prep sessions</li>
            <li>Get adequate sleep (7-9 hours)</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Week 9-12: Peak Performance</h4>
        <ul>
            <li>Implement advanced training techniques</li>
            <li>Maintain disciplined nutrition habits</li>
            <li>Monitor progress with measurements and photos</li>
            <li>Build sustainable long-term habits</li>
            <li>Celebrate milestones and set new goals</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">🎯 Fitness Milestones</h4>
        <p><strong>✓ 30 days:</strong> Improved energy levels, noticeably stronger</p>
        <p><strong>✓ 60 days:</strong> Visible muscle definition, increased endurance</p>
        <p><strong>✓ 90 days:</strong> Transformed physique, confident and healthy</p>
    `;
}

function generateEducationPlan(ageGroup) {
    return `
        <h3>🎓 Your Education Flight Plan</h3>
        <p>Your learning journey is about to reach new heights! Here's your path to mastery:</p>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Timeline: 6 Months to Expertise</h4>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Month 1-2: Fundamentals</h4>
        <ul>
            <li>Choose specific skills or subjects to master</li>
            <li>Enroll in structured courses (Coursera, Udemy, etc.)</li>
            <li>Study 1-2 hours daily consistently</li>
            <li>Take detailed notes and create study guides</li>
            <li>Join study groups or online communities</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Month 3-4: Deep Learning</h4>
        <ul>
            <li>Complete advanced coursework and projects</li>
            <li>Apply knowledge to real-world problems</li>
            <li>Build a portfolio or collect certificates</li>
            <li>Teach others to deepen understanding</li>
            <li>Connect with mentors and experts</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Month 5-6: Mastery</h4>
        <ul>
            <li>Create meaningful projects demonstrating expertise</li>
            <li>Contribute to open-source or community projects</li>
            <li>Share knowledge through blogs or presentations</li>
            <li>Maintain continuous learning habits</li>
            <li>Plan next learning milestones</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">🎯 Learning Metrics</h4>
        <p><strong>✓ 60 days:</strong> Complete foundational courses, pass assessments</p>
        <p><strong>✓ 120 days:</strong> Build 2-3 portfolio projects, achieve certification</p>
        <p><strong>✓ 180 days:</strong> Demonstrate expertise and help others learn</p>
    `;
}

function generateFinancialPlan(ageGroup) {
    const timeline = ageGroup === 'teen' ? '5 years' : ageGroup === 'twenties' ? '3 years' : '2 years';

    return `
        <h3>💰 Your Financial Flight Plan</h3>
        <p>Your journey to financial freedom starts here! Here's your personalized money strategy:</p>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Timeline: ${timeline} to Financial Stability</h4>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Phase 1: Assessment & Foundation</h4>
        <ul>
            <li>Calculate your net worth and financial goals</li>
            <li>Track all income and expenses for 1 month</li>
            <li>Build an emergency fund (3-6 months expenses)</li>
            <li>Pay off high-interest debt</li>
            <li>Create a realistic monthly budget</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Phase 2: Smart Saving & Investing</h4>
        <ul>
            <li>Automate savings (start with 10-20% of income)</li>
            <li>Open investment accounts (retirement, brokerage)</li>
            <li>Invest in diversified index funds and ETFs</li>
            <li>Understand compound interest and long-term growth</li>
            <li>Monitor and adjust your portfolio regularly</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Phase 3: Wealth Building</h4>
        <ul>
            <li>Increase income through raises or side projects</li>
            <li>Expand investment portfolio strategically</li>
            <li>Develop passive income streams</li>
            <li>Protect wealth through insurance and estate planning</li>
            <li>Plan for major life goals (home, education, retirement)</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">🎯 Financial Milestones</h4>
        <p><strong>✓ 6 months:</strong> Emergency fund complete, debt reduced by 20%</p>
        <p><strong>✓ 1 year:</strong> Consistent savings habit, investments started</p>
        <p><strong>✓ Long-term:</strong> Financial security and wealth growth</p>
    `;
}

function generateTravelPlan(ageGroup) {
    const budget = ageGroup === 'teen' ? 'Budget ($2-5k)' : ageGroup === 'twenties' ? 'Mid-range ($5-10k)' : 'Comfortable ($10k+)';

    return `
        <h3>✈️ Your Travel Flight Plan</h3>
        <p>Get ready to explore the world! Here's your journey to adventure:</p>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Budget Level: ${budget}</h4>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Month 1: Planning & Preparation</h4>
        <ul>
            <li>Choose your destination(s) strategically</li>
            <li>Set travel dates and book accommodations early</li>
            <li>Research visa requirements and travel documents</li>
            <li>Create detailed itinerary and bucket list items</li>
            <li>Start saving and compare flight prices</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Month 2: Preparation & Learning</h4>
        <ul>
            <li>Book flights and secure travel insurance</li>
            <li>Learn basic phrases in local language</li>
            <li>Research local culture, customs, and etiquette</li>
            <li>Plan transportation and activities in advance</li>
            <li>Pack smartly and prepare documents</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Travel Execution</h4>
        <ul>
            <li>Embark on your adventure with confidence</li>
            <li>Immerse yourself in local experiences</li>
            <li>Stay safe and maintain budget awareness</li>
            <li>Capture memories and share experiences</li>
            <li>Reflect and plan next adventure</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">🎯 Travel Achievements</h4>
        <p><strong>✓ Pre-travel:</strong> All documents ready, itinerary finalized</p>
        <p><strong>✓ During travel:</strong> Experience authentic local culture</p>
        <p><strong>✓ Post-travel:</strong> Unforgettable memories, personal growth</p>
    `;
}

function generateGeneralPlan(ageGroup, goal) {
    return `
        <h3>🚀 Your Personal Flight Plan</h3>
        <p><strong>Goal:</strong> ${goal}</p>
        <p>Here's your customized roadmap to success:</p>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Timeline: 90 Days to Achievement</h4>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Week 1-2: Define & Plan</h4>
        <ul>
            <li>Break down your goal into measurable milestones</li>
            <li>Identify resources and skills needed</li>
            <li>Create a detailed action plan</li>
            <li>Set specific, achievable targets</li>
            <li>Find accountability partners or mentors</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Week 3-6: Execution & Learning</h4>
        <ul>
            <li>Execute your action plan consistently</li>
            <li>Track progress daily or weekly</li>
            <li>Learn and adapt your approach as needed</li>
            <li>Overcome obstacles with creativity</li>
            <li>Celebrate small wins along the way</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">Week 7-12: Optimize & Sustain</h4>
        <ul>
            <li>Refine your strategies based on results</li>
            <li>Build sustainable habits for long-term success</li>
            <li>Expand your capabilities and reach</li>
            <li>Share your progress and inspire others</li>
            <li>Plan your next growth phase</li>
        </ul>
        
        <h4 style="color: #0066CC; margin-top: 1.5rem;">🎯 Success Markers</h4>
        <p><strong>✓ 30 days:</strong> Consistent progress, habits forming</p>
        <p><strong>✓ 60 days:</strong> Noticeable achievements, momentum building</p>
        <p><strong>✓ 90 days:</strong> Goal reached or well on the way, transformation evident</p>
    `;
}

// Download Plan Function
function downloadPlan() {
    const { zipcode, age, goal } = formData;
    const timestamp = new Date().toLocaleDateString();
    
    const planText = `
SKYGOAL - PERSONALIZED FLIGHT PLAN
Generated: ${timestamp}

USER PROFILE
Location (Zip Code): ${zipcode}
Age: ${age}
Goal: ${goal}
User Email: ${currentUser}

${document.getElementById('planContent').innerText}

---
This personalized plan was generated by SkyGoal to help you achieve your goals.
Remember: Success requires consistent action and dedication.
Believe in yourself and take flight! ✈️
    `;

    // Create a blob and download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(planText));
    element.setAttribute('download', `SkyGoal_Plan_${zipcode}_${timestamp.replace(/\//g, '-')}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('Your flight plan has been downloaded! Good luck on your journey! ✈️');
}

// Restart Process
function restartProcess() {
    // Reset UI
    formData = {
        zipcode: '',
        age: '',
        goal: ''
    };
    
    goalForm.reset();
    resultsSection.classList.add('hidden');
    document.getElementById('form-section').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('SkyGoal website loaded successfully!');
    // Page is ready
});
