<script>
    let status_url = STATUS_URL;
</script>

<div class="notification is-danger is-light">
    <div class="content is-medium">
        <p><b>서버 오류</b>로 인해 프로젝트 정보를 불러오는데 실패했습니다.</p>
        <p>아래의 버튼을 클릭해 서버의 상태를 확인 할 수 있습니다.</p>
    </div>
    <div class="buttons">
        <a class="button is-danger" href="{status_url}" target="_blank">서버 상태 확인하기</a>
        <button
            class="button is-primary"
            on:click="{() => {
                location.reload();
            }}">다시 시도하기</button>
    </div>
</div>
