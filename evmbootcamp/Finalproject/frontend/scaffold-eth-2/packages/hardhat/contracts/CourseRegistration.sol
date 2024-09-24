// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourseRegistration {
    address public owner;

    struct Course {
        string name;
        uint256 registrationFee;
        uint256 maxParticipants;
        uint256 participantCount;
        mapping(address => bool) registeredParticipants;
    }

    mapping(uint256 => Course) public courses;
    uint256 public courseCount;

    event NewRegistration(uint256 courseId, address participant);

    constructor() {
        owner = msg.sender;
    }

    function createCourse(string memory _name, uint256 _fee, uint256 _maxParticipants) public {
        require(msg.sender == owner, "Only owner can create courses.");
        Course storage newCourse = courses[courseCount];
        newCourse.name = _name;
        newCourse.registrationFee = _fee;
        newCourse.maxParticipants = _maxParticipants;
        newCourse.participantCount = 0;
        courseCount++;
    }

    function register(uint256 _courseId) public payable {
        Course storage course = courses[_courseId];

        require(course.participantCount < course.maxParticipants, "Course is full.");
        require(msg.value == course.registrationFee, "Incorrect registration fee.");
        require(!course.registeredParticipants[msg.sender], "Already registered.");

        course.registeredParticipants[msg.sender] = true;
        course.participantCount++;

        emit NewRegistration(_courseId, msg.sender);
    }

    function getCourse(uint256 _courseId) public view returns (string memory, uint256, uint256, uint256) {
        Course storage course = courses[_courseId];
        return (course.name, course.registrationFee, course.maxParticipants, course.participantCount);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw.");
        payable(owner).transfer(address(this).balance);
    }
}
