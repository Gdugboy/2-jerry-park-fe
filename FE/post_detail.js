// 게시물 삭제 모달 여닫는 JS 함수임
const openModal = (type) => {
    if (type === 'delete') {
        document.getElementById('deleteModal').style.display = 'flex';
    }
}
const closeModal = () => {
    document.getElementById('deleteModal').style.display = 'none';
}


// 댓글 삭제 모달 여닫는 JS 함수
const openCommentDeleteModal = (comment_id) => {
    document.getElementById('commentDeleteModal').style.display = 'flex'; // 댓글 삭제 모달 열기

    // console.log('comment_id: ',comment_id);
    // 삭제 버튼 클릭 시 해당 댓글 삭제 처리
    const deleteButton = document.getElementById('confirmDeleteButton');  // 모달 내 삭제 버튼
    deleteButton.onclick = () => confirmCommentDelete(comment_id);
}
function closeCommentDeleteModal() {
    document.getElementById('commentDeleteModal').style.display = 'none';
}

// 모달에서 삭제 버튼 확정시 (게시글 삭제)
const confirmCommentDelete = (comment_id) => {
    console.log('삭제할 commentid : ', comment_id);
    fetch(`http://localhost:3000/api/posts/comments/${comment_id}`, {
        method: 'DELETE',
        headers : {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            alert('댓글이 삭제되었습니다.');
            location.reload(); // 페이지 새로고침
            closeCommentDeleteModal(); // 모달 닫기
        } else {
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('댓글 삭제 오류 : ', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
    })
}

// 댓글 입력시 댓글작성 버튼 색 바뀌는 함수
// 제목, 내용 받아오기
const commentInput = document.getElementById('comment');
const commentUpButton = document.getElementById('commentUp');

// 입력 상태로 버튼 색상 바꾸기
const updateButtonState = () => {
    if(commentInput.value.trim() !==''){
        commentUpButton.classList.add('active');
    } else {
        commentUpButton.classList.remove('active');
    }
}
commentInput.addEventListener('input',updateButtonState);

// URL 에서 post_id 가져오기
// 현재 페이지에서 특정 파라미터를 가져오도록 URLSeachParams 사용
const urlParams = new URLSearchParams(window.location.search);
const post_id = urlParams.get('post_id'); // post_id 이름의 파라미터 가져옴


// post_id 존재하는지 확인하고 받아오기 (async function 추가하는 것이.,.,)
if (post_id) {
    // 페이지 로드 시 조회수 증가 API 호출
    fetch(`http://localhost:3000/api/posts/views/?post_id=${post_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // 조회수 넣기
        console.log("조회수데이터",data);
        document.querySelector('.views').textContent = data.views;
        if (data.success) {
            console.log('조회수 증가 성공');
        } else {
            console.error('조회수 증가 실패');
        }
    })
    .catch(error => {
        console.error('조회수 증가 중 오류:', error);
    });

    // post_id 있다면, fetch 요청
    fetch(`http://localhost:3000/api/posts/post?post_id=${post_id}`)
        .then(response => response.json())
        .then(data => {
            // 서버에서 받은 데이터로 페이지에 데이터 표시 
            // 클래스 title, h1태그 부분에
            document.querySelector('.title h1').textContent = data.title;
            document.querySelector('.content p').textContent = data.content;
            // document.querySelector('.likes').textContent = data.likes;
            
            document.querySelector('.userinfo p').textContent = data.nickname;
            document.getElementById('profile_img').src = `http://localhost:3000${data.profile_img}`;
            console.log(data)
            // 게시물 이미지 있으면 이미지 표시
            if (data.image){
                document.getElementById('image3').src = `http://localhost:3000${data.image}`;
            } else {
                document.getElementById('image3').style.display = 'none'; // 이미지 없으면 없게
            }
            
            // 날짜 포맷 변경하기
            const created_time = data.created_time;
            const date = new Date(created_time);
            const formattedDate = date.toLocaleString('ko-KR', {
                weekday: 'short',  // 요일 (예: 월, 화, 수)
                year: 'numeric',   // 연도 (예: 2024)
                month: 'long',     // 월 (예: 11월)
                day: 'numeric',    // 일 (예: 22)
                hour: '2-digit',   // 시간 (예: 16)
                minute: '2-digit', // 분 (예: 43)
                second: '2-digit', // 초 (예: 34)
            });
            document.querySelector('.userinfo p1').textContent = formattedDate;

            // 좋아요수 넣기
            updateLikes(data.likes);

            // 댓글도 가져오기
            fetchComments(post_id);
            // 상단 로그인한 유저 이미지도 가져오기
            loadloginProfileImage();
        })
        .catch(error => {
            // 에러 출력
            console.error('게시물 조회 중 오류', error);
        });
} else {
    // post_id 가 없을 경우 출력
    console.log('post_id가 존재하지 않음(db나 url에)');
}

// 댓글 가져오기 fetch
const fetchComments = (post_id) => {
    fetch(`http://localhost:3000/api/posts/comments?post_id=${post_id}`)
        .then(response => response.json())    // 응답을 json 형식으로 (Promise 반환)
        .then(data => {
            console.log(data);
            if (data && data.comments) {
                const { comments, commentCount } = data;
                document.querySelector('.commentsu').textContent = commentCount;

                if(comments.length > 0) {
                    // 댓글 있다면, 각 댓글을 forEach로 페이지에 추가
                    comments.forEach(comment=> {
                        addCommentToPage(comment);
                    });
            } else {
                console.log("댓글이 없습니다.");
        } 
    } else {
            console.log("댓글 데이터가 없습니다.");
    }
    })
    .catch(error => {
        console.error('댓글 가져오는 중 오류 발생', error);
    });
}

// 댓글 가져오기
const addCommentToPage = (comment) => {
    if(!comment.nickname || !comment.created_time || !comment.content){
        console.error("댓글 데이터가 부족합니다.", comment);
        return;
    }
    // 댓글 추가할 클래스 allcommentBox
    const commentBox = document.querySelector('.allcommentBox');
    
    // 댓글 작성 유저 프로필 이미지 받아오기
    const profile_img = `http://localhost:3000${comment.profile_img}`;

    const commentHTML = `
        <div class="commentInfo" id="comment-${comment.comment_id}">
            <div class="comments">
                <img class="image4" src="${profile_img}" >
                <div class="author">${comment.nickname}</div>
                <div class="date">${formatDate(comment.created_time)}</div>
            </div>
            <div class="commentcontent">
                ${comment.content}
            </div>
        </div>
        <div class="editdelete">
            <div class="editdelB">
                <button onclick="editComment(${comment.comment_id}, '${comment.content}')">수정</button>
                <button onclick="openCommentDeleteModal(${comment.comment_id})">삭제</button>
            </div>
        </div>
    `;
    commentBox.insertAdjacentHTML('beforeend', commentHTML);
    // 위의 HTML을 .allcommentBox에 추가
}

// (댓글) 날짜 포맷팅 함수
const formatDate = (dateStr) => {
    const date = new Date(dateStr);  // 날짜 문자열을 Date 객체로 변환
    return date.toLocaleString('ko-KR', {
        year: 'numeric',  // 연도
        month: 'numeric', // 월
        day: 'numeric',   // 일
        hour: '2-digit',  // 시간
        minute: '2-digit',// 분
        second: '2-digit' // 초
    });
}

// 댓글 작성하기 버튼 누르면 댓글 작성
const commentUp = () => {
    // 댓글 내용 가져오기 (앞뒤 공백 제거)
    const commentContent = document.getElementById('comment').value.trim();

    // 댓글 내용 비어있으면 알림 띄우고 함수 종료
    if (commentContent === ''){
        alert('댓글을 입력하세요!');
        return;
    }

    // post_id 없으면 알림 띄우고 함수 종료
    if (!post_id){
        alert('post_id 없음');
        return;
    }

    // user_id 저장한 곳 어디더라.... getItem(user_id 저장된 키값이름)
    // localStorage에 저장한 사용자 정보 가져오기
    const user_id = localStorage.getItem('user_id');

    // 유저 아이디 없으면 알림 띄우고 함수 종료
    if (!user_id) {
        alert('로그인 정보가 없습니다. (user_id)');
        return;
    }

    fetch(`http://localhost:3000/api/posts/comments`, {
        method: 'POST', 
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
            post_id: post_id,
            content: commentContent,
            user_id: user_id,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message){
            console.log(data.message); //서버에서 받은 메세지
        }
        alert('댓글 등록 완료 !');
        location.reload(); // 페이지 새로고침
    })
    .catch(error => {
        console.error('댓글 등록 중 오류 발생', error);
    })
}

// 댓글 수정 함수
const editComment = (comment_id, content) => {
    // 댓글 입력 창에 기존 댓글 내용을 설정
    const commentInput = document.getElementById('comment');
    commentInput.value = content;

    // 댓글 작성 버튼을 "수정 완료" 모드로 전환
    const commentUpButton = document.getElementById('commentUp');
    commentUpButton.textContent = '댓글 수정';
    commentUpButton.onclick = () => updateComment(comment_id);
}

// 댓글 수정 함수
const updateComment = (comment_id) => {
    const updatedContent = document.getElementById('comment').value.trim();

    if (!updatedContent) {
        alert('수정할 내용을 입력하세요');
        return;
    }
    fetch(`http://localhost:3000/api/posts/comments/${comment_id}` , {
        method : 'PUT',
        headers : {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // 댓글 수정 응답 확인
        if (data.message === '댓글 수정 완료') {
            alert('댓글 수정 완료!');
            location.reload(); // 페이지 새로고침하여 댓글 반영
        } else {
            alert('댓글 수정 중 오류 발생');
        }
    })
    .catch(error => {
        console.error('댓글 수정 중 오류 발생 : ', error);
    });
}

const goToEditPage = (post_id) => {

    window.location.href = `edit_post.html?post_id=${post_id}`;
}

const confirmDelete = async (post_id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/post?post_id=${post_id}`, {
            method: 'DELETE',
            headers : {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('게시물 삭제 실패');
        }

        const data = await response.json();

        if(data.success) {
            alert('게시물이 삭제되었습니다.');
            window.location.href = "postlist.html";
        } else {
            alert('게시물 삭제 중 오류가 발생했습니다.');
        } 
    } catch (error) {
        console.error('삭제 중 오류 발생 : ', error);
        alert('게시물 삭제 중 오류가 발생');
    }
}

// localStorage 에서 user_id 가져와서 프로필 이미지 가져오기
const loadloginProfileImage = async () => {
    const user_id = localStorage.getItem("user_id");

    if (user_id) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user_id}`);

            if(!response.ok) {
                throw new Error('상단 유저프로필 이미지 불러오는 중 오류');
            }

            // 응답을 user로
            const user = await response.json();

            console.log(user.profile_img);
            // 넣을 곳
            const profile_img = document.getElementById("profile_imghead");
            profile_img.src = `http://localhost:3000${user.profile_img}`
        
        } catch(err) {
            console.error('상단 유저 프로필 이미지 오류', err);
        }
    } else {
        console.log('로그인 사용자정보 없음');
    }
}

// 좋아요 증가 함수
const likePost = () => {
    fetch(`http://localhost:3000/api/posts/like?post_id=${post_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {
            updateLikes(data.likes);
            alert('좋아요 !');

        } else {
            alert('좋아요 중 오류가 발생했습니다.');
        }
    })
    .catch(err => {
        console.error('좋아요 증가 중 오류 발생 : ', err);
    });
}

const updateLikes = (likes) => {
    const likesCount = document.getElementById('likes')
    likesCount.textContent = likes;
}