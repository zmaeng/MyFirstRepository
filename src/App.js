import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // 과목 추가 함수
  const addSubject = () => {
    const newSubject = {
      category: '교양',
      type: '선택',
      name: '',
      credits: 1,
      attendance: 0,
      assignment: 0,
      midterm: 0,
      final: 0,
    };
    setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    setShowSummary(false);
  };

  // 과목 정보 업데이트 함수
  const updateSubject = (index, field, value) => {
    setSubjects(prevSubjects => {
      const updatedSubjects = [...prevSubjects];
      updatedSubjects[index][field] = value;
      return updatedSubjects;
    });
  };

  // 입력값이 잘못되었을 경우 기본값으로 설정하는 함수
  const handleBlur = (index, field, value, max) => {
    if (isNaN(value) || value < 0 || value > max || !Number.isInteger(parseFloat(value))) {
      alert(`0에서 ${max} 사이의 정수만 입력해주세요.`);
      updateSubject(index, field, 0);
    }
  };

  // 선택된 항목 삭제 함수
  const handleDelete = () => {
    if (selectedToDelete.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
    const deletedSubjects = selectedToDelete.map(index => subjects[index].name || '(이름 없음)');
    setSubjects(prevSubjects => prevSubjects.filter((_, index) => !selectedToDelete.includes(index)));
    alert(`${deletedSubjects.join(', ')} 과목이 삭제되었습니다.`);
    setSelectedToDelete([]); // 체크박스 선택 초기화
    setShowSummary(true);
  };

  // 체크박스 onChange 핸들러
  const handleCheckboxChange = (index) => {
    setSelectedToDelete(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  // 저장 버튼 핸들러: 중복 과목 검사와 총점 제한 검사 포함
  const handleSave = () => {
    const subjectNames = subjects.map(subj => subj.name.trim()).filter(name => name !== '');
    if (subjectNames.length !== subjects.length) {
      alert('과목명은 빈칸일 수 없습니다.');
      return;
    }

    const invalidTotalScores = subjects.some(subj => {
      const totalScore = subj.attendance + subj.assignment + subj.midterm + subj.final;
      return totalScore < 0 || totalScore > 100;
    });
    if (invalidTotalScores) {
      alert('과목별 총점은 0에서 100 사이여야 합니다.');
      return;
    }

    const nonFSubjects = subjects.filter(subj => calculateGrade(subj.attendance + subj.assignment + subj.midterm + subj.final) !== 'F');
    const uniqueNames = new Set(nonFSubjects.map(subj => subj.name));
    if (uniqueNames.size !== nonFSubjects.length) {
      alert('동일한 과목명이 존재합니다. 다시 확인해주세요.');
      return;
    }

    alert(`${subjectNames.join(', ')} 과목이 저장되었습니다.`);
    setSubjects(subjects.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.name.localeCompare(b.name);
    }));
    setShowSummary(true);
  };

  const totalScores = subjects.map(subj => subj.attendance + subj.assignment + subj.midterm + subj.final);
  const totalCredits = subjects.reduce((acc, subj) => acc + subj.credits, 0);
  const totalAttendance = subjects.reduce((acc, subj) => acc + subj.attendance, 0);
  const totalAssignment = subjects.reduce((acc, subj) => acc + subj.assignment, 0);
  const totalMidterm = subjects.reduce((acc, subj) => acc + subj.midterm, 0);
  const totalFinal = subjects.reduce((acc, subj) => acc + subj.final, 0);
  const totalScoreSum = totalScores.reduce((acc, score) => acc + score, 0);
  const averageScore = subjects.length > 0 ? (totalScoreSum / subjects.length).toFixed(2) : '';

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Front-end 과제</h1>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <label className="form-label mb-0">
          학년 선택:
          <select className="form-select w-auto d-inline-block ms-2" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="1학년">1학년</option>
            <option value="2학년">2학년</option>
            <option value="3학년">3학년</option>
          </select>
        </label>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={addSubject}>추가</button>
          <button className="btn btn-success" onClick={handleSave}>저장</button>
          <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
        </div>
      </div>

      <table className="table table-bordered text-center">
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
              <tr key={index} className={index % 2 === 0 ? 'table-light' : 'table-secondary'}>
                <td>
                  <select className="form-select" value={subject.category} onChange={(e) => updateSubject(index, 'category', e.target.value)}>
                    <option value="교양">교양</option>
                    <option value="전공">전공</option>
                  </select>
                </td>
                <td>
                  <select className="form-select" value={subject.type} onChange={(e) => updateSubject(index, 'type', e.target.value)}>
                    <option value="필수">필수</option>
                    <option value="선택">선택</option>
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control" value={subject.name} onChange={(e) => updateSubject(index, 'name', e.target.value)} />
                </td>
                <td>
                  <input type="number" className="form-control text-center" value={subject.credits} onChange={(e) => updateSubject(index, 'credits', parseInt(e.target.value))} min="1" max="3" />
                </td>
                <td>
                  <input type="number" className="form-control text-center" value={subject.attendance} onChange={(e) => updateSubject(index, 'attendance', parseInt(e.target.value))} min="0" max="20" onBlur={(e) => handleBlur(index, 'attendance', e.target.value, 20)} />
                </td>
                <td>
                  <input type="number" className="form-control text-center" value={subject.assignment} onChange={(e) => updateSubject(index, 'assignment', parseInt(e.target.value))} min="0" max="20" onBlur={(e) => handleBlur(index, 'assignment', e.target.value, 20)} />
                </td>
                <td>
                  <input type="number" className="form-control text-center" value={subject.midterm} onChange={(e) => updateSubject(index, 'midterm', parseInt(e.target.value))} min="0" max="30" onBlur={(e) => handleBlur(index, 'midterm', e.target.value, 30)} />
                </td>
                <td>
                  <input type="number" className="form-control text-center" value={subject.final} onChange={(e) => updateSubject(index, 'final', parseInt(e.target.value))} min="0" max="30" onBlur={(e) => handleBlur(index, 'final', e.target.value, 30)} />
                </td>
                <td>{totalScore}</td>
                <td></td>
                <td style={{ color: grade === 'F' ? 'red' : 'black' }}>{subject.credits === 1 ? (isPass ? 'P' : 'NP') : grade}</td>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedToDelete.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
              </tr>
            );
          })}
          <tr className="table-primary fw-bold">
            <td colSpan="3">합계</td>
            {showSummary ? (
              <>
                <td>{totalCredits}</td>
                <td>{totalAttendance}</td>
                <td>{totalAssignment}</td>
                <td>{totalMidterm}</td>
                <td>{totalFinal}</td>
                <td>{totalScoreSum}</td>
                <td>{averageScore}</td>
                <td>{calculateGrade(averageScore)}</td>
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
