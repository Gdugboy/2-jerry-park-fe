// function nextPage() {
// window.location.href = "post_detail.html"; //이동할 페이지
// }   

// url에서 post_id 파라미터 가져옴
const urlParams = new URLSearchParams(window.location.search);
const post_id = urlParams.get('post_id');

// 서버에서 게시물 데이터 가져오기
async function loadPostData(post_id) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/post?post_id=${post_id}`);

        if (!response.ok) {
            throw new Error('게시물 가져오는 데 실패했습니다.');
        }

        const postData = await response.json();

        document.getElementById('title').value = postData.title;
        document.getElementById('content').value = postData.content;
    } catch(error) {
        console.error('게시물 로드 오류 : ', error);
    }
}

async function updatePost(post_id){
    console.log(post_id); //!!!!!!!!!언디파인 뜸
    const updatedTitle = document.getElementById('title').value.trim();
    const updatedContent = document.getElementById('content').value.trim();

    // 제목, 댓글 비었는지 검사
    if (!updatedTitle || !updatedContent){
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }

    const response = await fetch(`http://localhost:3000/api/posts/post?post_id=${post_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
        }),
    });

    const data = await response.json();

    if(data.success) {
        alert('게시글 수정 완료!');
        window.location.href = `post_detail.html?post_id=${post_id}`;
    } else {
        alert('게시글 수정 중 오류 발생');
    }
}
// 페이지 로드 시 데이터 로드 함수 실행
loadPostData(post_id);

