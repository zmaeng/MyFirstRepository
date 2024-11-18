import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 학점 계산 함수
function calculateGrade(totalScore) {
  if (totalScore >= 95) return 'A+';
  if (totalScore >= 90) return 'A0';
  if (totalScore >= 85) return 'B+';
  if (totalScore >= 80) return 'B0';
  if (totalScore >= 75) return 'C+';
  if (totalScore >= 70) return 'C0';
  if (totalScore >= 65) return 'D+';
  if (totalScore >= 60) return 'D0';
  return 'F';
}

function ScoreCalculation() {
  const [subjects, setSubjects] = useState([]);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [selectedYear, setSelectedYear] = useState('1학년');
  const [showSummary, setShowSummary] = useState(false);

  const addSubject = () => {
    setSubjects(prevSubjects => [
      ...prevSubjects,
      {
        category: '교양',
        type: '선택',
        name: '',
        credits: 1,
        attendance: 0,
        assignment: 0,
        midterm: 0,
        final: 0,
      },
    ]);
    setShowSummary(false);
  };

  const updateSubject = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const validateInput = (value, max) => {
    if (isNaN(value) || value < 0 || value > max || !Number.isInteger(parseFloat(value))) {
      alert(`0에서 ${max} 사이의 정수만 입력해주세요.`);
      return false;
    }
    return true;
  };

  const handleBlur = (index, field, value, max) => {
    if (!validateInput(value, max)) {
      updateSubject(index, field, 0);
    }
  };

  const handleDelete = () => {
    setSubjects(prevSubjects => {
      const updatedSubjects = prevSubjects.filter((_, index) => !selectedToDelete.includes(index));
      return updatedSubjects;
    });
    setShowSummary(true);
  };

  const handleSave = () => {
    const subjectNames = subjects.map(subj => subj.name.trim()).filter(name => name !== '');
    if (subjectNames.length !== subjects.length) {
      alert('과목명은 빈칸일 수 없습니다.');
      return;
    }

    const nonFSubjects = subjects.filter(subj => calculateGrade(subj.attendance + subj.assignment + subj.midterm + subj.final) !== 'F');
    const nonFSubjectNames = nonFSubjects.map(subj => subj.name);
    const uniqueNames = new Set(nonFSubjectNames);

    if (uniqueNames.size !== nonFSubjectNames.length) {
      alert('동일한 과목명이 존재합니다. 다시 확인해주세요.');
    } else {
      alert('저장되었습니다.');
      const sortedSubjects = [...subjects].sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setSubjects(sortedSubjects);
      setShowSummary(true);
    }
  };

  const totalScores = subjects.map((subj) => {
    return subj.attendance + subj.assignment + subj.midterm + subj.final;
  });

  const totalCredits = subjects.reduce((acc, subj) => acc + subj.credits, 0);
  const totalAttendance = subjects.reduce((acc, subj) => acc + parseInt(subj.attendance), 0);
  const totalAssignment = subjects.reduce((acc, subj) => acc + parseInt(subj.assignment), 0);
  const totalMidterm = subjects.reduce((acc, subj) => acc + parseInt(subj.midterm), 0);
  const totalFinal = subjects.reduce((acc, subj) => acc + parseInt(subj.final), 0);
  const totalScoreSum = totalScores.reduce((acc, score) => acc + score, 0);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Front-end 과제</h1>
      <div className="mb-3">
        <label className="form-label">
          학년 선택:
          <select className="form-select w-auto d-inline-block ms-2" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="1학년">1학년</option>
            <option value="2학년">2학년</option>
            <option value="3학년">3학년</option>
          </select>
        </label>
      </div>
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={addSubject}>추가</button>
        <button className="btn btn-success" onClick={handleSave}>저장</button>
        <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
      </div>
      <table className="table table-bordered text-center"> {/* 모든 셀을 가운데 정렬 */}
        <thead className="table-dark">
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
            <th>평균</th>
            <th>성적</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => {
            const totalScore = subject.attendance + subject.assignment + subject.midterm + subject.final;
            const grade = calculateGrade(totalScore);
            const isPass = subject.credits === 1 && totalScore >= 60;

            return (
              <tr key={index} style={{ backgroundColor: grade === 'F' ? 'lightcoral' : 'white' }}>
                <td>
                  <select
                    className="form-select"
                    value={subject.category}
                    onChange={(e) => updateSubject(index, 'category', e.target.value)}
                  >
                    <option value="교양">교양</option>
                    <option value="전공">전공</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={subject.type}
                    onChange={(e) => updateSubject(index, 'type', e.target.value)}
                  >
                    <option value="필수">필수</option>
                    <option value="선택">선택</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={subject.name}
                    onChange={(e) => updateSubject(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={subject.credits}
                    onChange={(e) => updateSubject(index, 'credits', parseInt(e.target.value))}
                    min="1"
                    max="3"
                    step="1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={subject.attendance}
                    onChange={(e) => updateSubject(index, 'attendance', parseInt(e.target.value))}
                    min="0"
                    max="20"
                    step="1"
                    onBlur={(e) => handleBlur(index, 'attendance', e.target.value, 20)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={subject.assignment}
                    onChange={(e) => updateSubject(index, 'assignment', parseInt(e.target.value))}
                    min="0"
                    max="20"
                    step="1"
                    onBlur={(e) => handleBlur(index, 'assignment', e.target.value, 20)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={subject.midterm}
                    onChange={(e) => updateSubject(index, 'midterm', parseInt(e.target.value))}
                    min="0"
                    max="30"
                    step="1"
                    onBlur={(e) => handleBlur(index, 'midterm', e.target.value, 30)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={subject.final}
                    onChange={(e) => updateSubject(index, 'final', parseInt(e.target.value))}
                    min="0"
                    max="30"
                    step="1"
                    onBlur={(e) => handleBlur(index, 'final', e.target.value, 30)}
                  />
                </td>
                <td>{totalScore}</td>
                <td></td>
                <td style={{ color: grade === 'F' ? 'red' : 'black' }}>{subject.credits === 1 ? (isPass ? 'P' : 'NP') : grade}</td>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedToDelete([...selectedToDelete, index]);
                      } else {
                        setSelectedToDelete(selectedToDelete.filter(i => i !== index));
                      }
                    }}
                  />
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan="3" className="text-center">합계</td>
            {showSummary ? (
              <>
                <td>{totalCredits}</td>
                <td>{totalAttendance}</td>
                <td>{totalAssignment}</td>
                <td>{totalMidterm}</td>
                <td>{totalFinal}</td>
                <td>{totalScoreSum}</td>
                <td>{subjects.length > 0 ? (totalScoreSum / subjects.length).toFixed(2) : ''}</td>
                <td>{calculateGrade(totalScoreSum / subjects.length)}</td>
              </>
            ) : (
              <td colSpan="8"></td>
            )}
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ScoreCalculation;
