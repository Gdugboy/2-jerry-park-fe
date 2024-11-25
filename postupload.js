// 제목, 내용 받아오기
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const compButton = document.getElementById('compb');

// 입력 상태로 버튼 색상 바꾸기
function updateButtonState() {
    if(titleInput.value.trim() !=='' && contentInput.value.trim()!==''){
        compButton.classList.add('active');
    } else {
        compButton.classList.remove('active');
    }
}

titleInput.addEventListener('input',updateButtonState);
content.addEventListener('input',updateButtonState);

async function uploadPost(event) {
    event.preventDefault(); // 폼 기본 동작 방지

    // 제목, 내용 안 비었는지 검사
    if (titleInput.value.trim() === '' || contentInput.value.trim()===''){
        alert("*제목, 내용을 모두 작성해주세요");
        return; //함수 종료
    }

    // user_id 가져와서 로그인 한 경우만 글 작성할 수 있도록
    const user_id = localStorage.getItem('user_id');
    // console.log('작성하려는 user_id :',user_id);
    if(!user_id){
        alert('로그인 후 글 작성해주세요');
        return;
    }
    // FormData 객체 생성
    // FormData는 폼 데이터를 서버로 보낼 때 사용하는 객체. (텍스트와 파일을 한 번에 서버로 전송)
    const formData = new FormData();

    // 제목과 내용을 FromData에 추가
    formData.append('title',titleInput.value); 
    formData.append('content', contentInput.value);
    formData.append('user_id',user_id);

    formData.forEach((value,key)=> {
        console.log(`${key}: ${value}`);
    })

    // !!!!!!!!이미지 구현 필요
    // 이미지 파일 추가 (선택된 경우만)
    const imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        // 서버에 POST 요청 fetch 로 보내기
        const response = await fetch('http://localhost:3000/api/posts', {
            method : 'POST',
            body: formData,
        });

    //서버 응답 확인
    if (response.ok) {
        const result = await response.json();
        console.log('게시글 작성 성공');
        window.location.href = 'postlist.html';
    } else {
        // 응답 상태 200 아니면 실패로 간주
        const errorData = await response.json();
        console.log('게시글 작성 실패 :', errorData.message);
    }
    }catch (error) {
        console.error('서버와 통신 실패', error);
    }   
}

// 'submit' 이벤트에서 uploadPost 호출
postForm.addEventListener('submit',uploadPost);
