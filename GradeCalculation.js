import React, { useState } from 'react';

// 학점 계산 함수
function calculateGrade(totalScore) {
    if (totalScore >= 90) return 'A0';
    if (totalScore >= 80) return 'B0';
    if (totalScore >= 70) return 'C0';
    if (totalScore >= 60) return 'D+';
    return 'F';
}

function App() {
    const [subjects, setSubjects] = useState([]);
    const [selectedYear, setSelectedYear] = useState('1학년');

    const addSubject = () => {
        setSubjects([
            ...subjects,
            { category: '교양', type: '선택', name: '', credits: 1, attendance: 0, assignment: 0, midterm: 0, final: 0 }
        ]);
    };

    const updateSubject = (index, field, value) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index][field] = value;
        setSubjects(updatedSubjects);
    };

    const deleteSubject = (index) => {
        const updatedSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(updatedSubjects);
    };

    const totalScores = subjects.map(
        (subj) => parseInt(subj.attendance) + parseInt(subj.assignment) + parseInt(subj.midterm) + parseInt(subj.final)
    );

    const totalCredits = subjects.reduce((acc, subj) => acc + subj.credits, 0);
    const totalAttendance = subjects.reduce((acc, subj) => acc + parseInt(subj.attendance), 0);
    const totalAssignment = subjects.reduce((acc, subj) => acc + parseInt(subj.assignment), 0);
    const totalMidterm = subjects.reduce((acc, subj) => acc + parseInt(subj.midterm), 0);
    const totalFinal = subjects.reduce((acc, subj) => acc + parseInt(subj.final), 0);
    const totalScoreSum = totalScores.reduce((acc, score) => acc + score, 0);
    const average = (totalScoreSum / subjects.length) || 0;

    return (
        <div>
            <h1>Front-end 과제</h1>
            <label>
                학년 선택:
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="1학년">1학년</option>
                    <option value="2학년">2학년</option>
                    <option value="3학년">3학년</option>
                </select>
            </label>
            <button onClick={addSubject}>추가</button>
            <table border="1">
                <thead>
                    <tr>
                        <th>이수</th>
                        <th>필수</th>
                        <th>과목명</th>
                        <th>학점</th>
                        <th>출석점수</th>
                        <th>과제점수</th>
                        <th>중간고사</th>
                        <th>기말고사</th>
                        <th>총점</th>
                        <th>성적</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, index) => {
                        const totalScore = parseInt(subject.attendance) + parseInt(subject.assignment) + parseInt(subject.midterm) + parseInt(subject.final);
                        const grade = calculateGrade(totalScore);
                        return (
                            <tr key={index} style={{ color: grade === 'F' ? 'red' : 'black' }}>
                                <td>{subject.category}</td>
                                <td>{subject.type}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={subject.name}
                                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={subject.credits}
                                        onChange={(e) => updateSubject(index, 'credits', e.target.value)}
                                        min="1"
                                        max="3"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={subject.attendance}
                                        onChange={(e) => updateSubject(index, 'attendance', e.target.value)}
                                        min="0"
                                        max="20"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={subject.assignment}
                                        onChange={(e) => updateSubject(index, 'assignment', e.target.value)}
                                        min="0"
                                        max="20"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={subject.midterm}
                                        onChange={(e) => updateSubject(index, 'midterm', e.target.value)}
                                        min="0"
                                        max="30"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={subject.final}
                                        onChange={(e) => updateSubject(index, 'final', e.target.value)}
                                        min="0"
                                        max="30"
                                    />
                                </td>
                                <td>{totalScore}</td>
                                <td>{grade}</td>
                                <td>
                                    <button onClick={() => deleteSubject(index)}>삭제</button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td colSpan="4">합계</td>
                        <td>{totalAttendance}</td>
                        <td>{totalAssignment}</td>
                        <td>{totalMidterm}</td>
                        <td>{totalFinal}</td>
                        <td>{totalScoreSum}</td>
                        <td>{average.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default App;
