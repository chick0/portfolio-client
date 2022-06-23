<script>
    import { push } from "svelte-spa-router";
    import { isLogined, getToken } from "../storage.js";
    import {
        storageList,
        storageUpload,
        storageManage,
        storageDownload,
    } from "../url.js";

    if (!isLogined()) {
        push("/");
    }

    let isLoaded = false;
    let newFile = false;
    let files = [];

    function resetNewUpload() {
        newFile = false;
        document.getElementById("storage-upload").value = "";
        document.getElementById("storage-upload-name").innerText =
            "선택된 파일 없음";
    }

    function fetchStorageList() {
        if (isLoaded == true) isLoaded = false;

        fetch(storageList(), {
            headers: {
                Authorization: getToken(),
            },
        })
            .then((resp) => resp.json())
            .then((json) => {
                Object.assign(files, json.items);
                isLoaded = true;
            });
    }

    fetchStorageList();
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">파일 관리</h1>

        <div class="box">
            <h5 class="title is-5">파일 업로드</h5>
            <p class="subtitle" id="storage-upload-name">선택된 파일 없음</p>

            <div class="buttons mb-0">
                <button
                    class="button is-info is-light is-medium"
                    on:click="{() => {
                        document.getElementById('storage-upload').click();
                    }}">
                    파일 선택
                </button>
                <div
                    class="button is-primary is-primary is-light is-medium"
                    on:click="{() => {
                        if (newFile == false) {
                            alert('먼저 파일을 선택해주세요.');
                            return;
                        }

                        let data = new FormData();
                        data.append(
                            'file',
                            document.getElementById('storage-upload').files[0]
                        );

                        fetch(storageUpload(), {
                            method: 'POST',
                            headers: {
                                Authorization: getToken(),
                            },
                            body: data,
                        })
                            .then((resp) => resp.json())
                            .then((json) => {
                                files.unshift(json);
                                files = files;
                                resetNewUpload();
                            });
                    }}">
                    파일 업로드
                </div>
            </div>

            <input
                id="storage-upload"
                type="file"
                hidden="hidden"
                on:change="{(e) => {
                    const file = e.target.files[0];
                    document.getElementById('storage-upload-name').innerText =
                        file.name;

                    if (file.size >= 1024 * 1024 * 99) {
                        alert('해당 파일은 업로드 할 수 없습니다.');
                        resetNewUpload();
                    } else {
                        newFile = true;
                    }
                }}" />
        </div>
    </div>
</section>

{#if isLoaded == false}
    <section class="section">
        <div class="container">
            <h2 class="title is-2">잠시만요...</h2>
            <p class="subtitle">요청을 처리하고 있습니다...</p>
        </div>
    </section>
{:else}
    <section class="section">
        <div class="container">
            {#each files as file}
                <div class="box">
                    <h5 class="title is-5">{file.name}</h5>
                    <p class="subtitle">{file.creation_date.pretty}</p>

                    <div id="storage-{file.uuid}" class="block"></div>

                    <div class="buttons">
                        <button
                            class="button is-danger is-light"
                            on:click="{() => {
                                let target = document.getElementById(
                                    `storage-${file.uuid}`
                                );

                                if (target.innerHTML.length == 0) {
                                    const updateHandle = (e) => {
                                        const replace = e.target.files[0];

                                        if (replace.size >= 1024 * 1024 * 99) {
                                            alert(
                                                '해당 파일은 업로드 할 수 없습니다.'
                                            );
                                            target.innerHTML = '';
                                        } else {
                                            let data = new FormData();
                                            data.append('file', replace);

                                            fetch(storageManage(file.uuid), {
                                                method: 'POST',
                                                headers: {
                                                    Authorization: getToken(),
                                                },
                                                body: data,
                                            })
                                                .then((resp) => resp.json())
                                                .then((json) => {
                                                    files[
                                                        files.findIndex(
                                                            (e) =>
                                                                e.uuid ==
                                                                file.uuid
                                                        )
                                                    ] = json;

                                                    files = files;
                                                    target.innerHTML = '';
                                                });
                                        }
                                    };

                                    let input = document.createElement('input');
                                    input.setAttribute('type', 'file');
                                    input.onchange = updateHandle;

                                    target.appendChild(input);
                                } else {
                                    target.innerHTML = '';
                                }
                            }}">
                            파일 수정
                        </button>
                        <button
                            class="button is-danger"
                            on:click="{() => {
                                if (
                                    confirm(
                                        `'${file.name}'(을)를 삭제하시겠습니까?`
                                    )
                                ) {
                                    fetch(storageManage(file.uuid), {
                                        method: 'DELETE',
                                        headers: {
                                            Authorization: getToken(),
                                        },
                                    })
                                        .then((resp) => resp.json())
                                        .then((json) => {
                                            if (json.result == true) {
                                                alert('파일이 삭제되었습니다.');

                                                files = files.filter((x) => {
                                                    return x.uuid != file.uuid;
                                                });
                                            } else {
                                                alert('오류가 발생했습니다.');
                                                fetchStorageList();
                                            }
                                        });
                                }
                            }}">
                            파일 삭제
                        </button>
                        <a
                            class="button is-link"
                            href="{storageDownload(file.uuid)}"
                            target="_blank">
                            다운로드
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    </section>
{/if}

<!-- button for desktop or tablet -->
<button
    class="button is-primary is-medium is-fullwidth container is-hidden-touch"
    style="position: -webkit-sticky; position: sticky; bottom: 10px;"
    on:click="{() => {
        push('/');
    }}">
    프로젝트 목록으로 이동
</button>

<!-- button for mobile -->
<button
    class="button is-primary is-medium is-fullwidth container is-hidden-desktop"
    style="position: -webkit-sticky; position: sticky; bottom: 10px; max-width: 90%;"
    on:click="{() => {
        push('/');
    }}">
    프로젝트 목록으로 이동
</button>

<section class="section"></section>
