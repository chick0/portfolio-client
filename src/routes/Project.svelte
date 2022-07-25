<script>
    import { push } from "svelte-spa-router";
    import { Renderer, setOptions, parse } from "marked";
    import { getProject, buttonCreate, buttonUpdate } from "../url.js";
    import { isLogined, getToken } from "../storage.js";
    import { tagStore } from "../store.js";
    export let params = {};

    let status_url = STATUS_URL;

    let projectLoaded = false;
    let url = getProject(params.uuid);

    const renderer = new Renderer();
    let project = {};

    let buttons = [];
    let buttonColors = [
        "is-white",
        "is-light",
        "is-dark",
        "is-black",
        "is-ghost",
        "is-primary",
        "is-link",
        "is-info",
        "is-success",
        "is-warning",
        "is-danger",
        "is-primary is-light",
        "is-link is-light",
        "is-info is-light",
        "is-success is-light",
        "is-warning is-light",
        "is-danger is-light",
    ];

    let fetchError = false;

    if (url != undefined) {
        // 올바른 프로젝트 ID가 아님
        push("/");
    } else {
        // @ts-ignore
        renderer.link = (href, title, text) => {
            return `<a target="_blank" rel="noreferrer" href="${href}">${text}</a>`;
        };

        setOptions({
            gfm: true,
            renderer: renderer,
        });

        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                Object.assign(project, data);
                projectLoaded = true;
                document.title = project.title;
            })
            .catch(() => {
                fetchError = true;
            });

        fetch(buttonUpdate(params.uuid))
            .then((resp) => resp.json())
            .then((json) => {
                Object.assign(buttons, json.buttons);
                buttons = buttons;
            });
    }
</script>

{#if projectLoaded == true}
    <section class="section">
        <div class="container">
            <h1 class="title is-1">{project.title}</h1>
            <p class="subtitle">{project.date.pretty}</p>

            <div class="block buttons" id="buttons">
                {#if project.github.length != 0}
                    <a class="button is-dark" href="{project.github}" target="_blank">Github</a>
                {/if}
                {#if project.web.length != 0}
                    <a class="button is-link" href="{project.web}" target="_blank">Web</a>
                {/if}
                {#each buttons as button}
                    <a class="button {button.color}" href="{button.url}" target="_blank">{button.text}</a>
                {/each}
            </div>

            <div class="block buttons">
                {#each project.tags as tag}
                    <button
                        class="button is-warning"
                        on:click|preventDefault="{() => {
                            tagStore.set(tag);
                            push('/');
                        }}">
                        #{tag}
                    </button>
                {/each}
            </div>

            {#if isLogined() == true}
                <div class="box">
                    <h5 class="title is-5">프로젝트 관리</h5>
                    <div class="buttons">
                        <button
                            class="button is-danger is-light"
                            on:click="{() => {
                                push(`/project/${project.uuid}/edit`);
                            }}">
                            프로젝트 수정
                        </button>
                        <button
                            class="button is-danger"
                            on:click="{() => {
                                if (confirm('해당 프로젝트를 삭제하시겠습니까? (1/2)')) {
                                    if (confirm('해당 프로젝트를 정말로 삭제하시겠습니까? (2/2)')) {
                                        fetch(url, {
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: getToken(),
                                            },
                                        })
                                            .then((resp) => resp.json())
                                            .then((data) => {
                                                if (data.status == true) {
                                                    alert('프로젝트가 삭제되었습니다.');
                                                    push('/');
                                                } else {
                                                    alert('프로젝트 삭제에 실패했습니다.');
                                                }

                                                projectLoaded = true;
                                            });

                                        projectLoaded = false;
                                        return;
                                    }
                                }

                                alert('취소되었습니다.');
                            }}">
                            프로젝트 삭제
                        </button>
                    </div>
                </div>

                <div class="box">
                    <h5 class="title is-5">버튼 관리</h5>
                    <div class="block">
                        <button
                            class="button is-info"
                            on:click="{() => {
                                if (buttons.findIndex((e) => e.uuid == 'undefined') == -1) {
                                    let newButton = {
                                        uuid: 'undefined',
                                        text: '이름 없는 버튼',
                                        url: location.href,
                                        color: 'is-link',
                                    };

                                    buttons.push(newButton);
                                    buttons = buttons;
                                } else {
                                    alert('저장되지 않은 버튼이 있습니다.');
                                }
                            }}">
                            새로운 버튼 만들기
                        </button>
                    </div>

                    {#each buttons as button}
                        <div class="box">
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label" for="button-text-{button.uuid}">텍스트</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control">
                                            <input
                                                class="input"
                                                type="text"
                                                id="button-text-{button.uuid}"
                                                bind:value="{button.text}" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label" for="button-link-{button.uuid}">링크</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control">
                                            <input
                                                class="input"
                                                type="url"
                                                id="button-link-{button.uuid}"
                                                bind:value="{button.url}" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label" for="button-color-{button.uuid}">색상</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control">
                                            <div class="select is-fullwidth">
                                                <select id="button-color-{button.uuid}" bind:value="{button.color}">
                                                    {#each buttonColors as color}
                                                        <option
                                                            class="{color.replace('is-', 'has-text-')}"
                                                            selected="{color == button.color}"
                                                            value="{color}">
                                                            {color}
                                                        </option>
                                                    {/each}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="columns">
                                <div class="column">
                                    <button
                                        class="button is-primary is-light is-fullwidth"
                                        on:click="{() => {
                                            let body = {};
                                            // copy from button
                                            Object.assign(body, button);
                                            // uuid is not required
                                            delete body['uuid'];

                                            if (button.uuid == 'undefined') {
                                                fetch(buttonCreate(params.uuid), {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: getToken(),
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(body),
                                                })
                                                    .then((resp) => resp.json())
                                                    .then((json) => {
                                                        const index = buttons.findIndex((e) => e.uuid == 'undefined');
                                                        buttons[index] = json;
                                                    });
                                            } else {
                                                fetch(buttonUpdate(button.uuid), {
                                                    method: 'PATCH',
                                                    headers: {
                                                        Authorization: getToken(),
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(body),
                                                })
                                                    .then((resp) => resp.json())
                                                    .then((json) => {
                                                        buttons[buttons.findIndex((e) => e.uuid == json.uuid)] = json;
                                                    });
                                            }
                                        }}">
                                        저장하기
                                    </button>
                                </div>
                                <div class="column">
                                    <button
                                        class="button is-danger is-light is-fullwidth"
                                        on:click="{() => {
                                            if (button.uuid == 'undefined') {
                                                buttons = buttons.filter((e) => {
                                                    return e.uuid != 'undefined';
                                                });
                                            } else {
                                                fetch(buttonUpdate(button.uuid), {
                                                    method: 'DELETE',
                                                    headers: {
                                                        Authorization: getToken(),
                                                    },
                                                })
                                                    .then((resp) => resp.json())
                                                    .then((json) => {
                                                        if (json.status === true) {
                                                            buttons = buttons.filter((e) => {
                                                                return e.uuid != button.uuid;
                                                            });
                                                        } else {
                                                            alert('오류가 발생했습니다.');
                                                        }
                                                    });
                                            }
                                        }}">
                                        삭제하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2 class="title is-2">기획의도</h2>
            <div class="content is-medium">{@html parse(project.a)}</div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2 class="title is-2">특징</h2>
            <div class="content is-medium">{@html parse(project.b)}</div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2 class="title is-2">느낀점</h2>
            <div class="content is-medium">{@html parse(project.c)}</div>
        </div>
    </section>

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
{:else}
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요...</h1>
            <p class="subtitle">프로젝트 정보를 불러오고 있습니다...</p>
            {#if fetchError == true}
                <div class="notification is-danger is-light">
                    <div class="content is-medium">
                        <p>서버 오류로 인해 프로젝트 정보를 불러오는데 실패했습니다.</p>
                        <p>아래의 버튼을 클릭해 서버의 상태를 확인 할 수 있습니다.</p>
                    </div>
                    <a class="button is-danger" href="{status_url}"> 서버 상태 확인하기 </a>
                </div>
            {/if}
        </div>
    </section>
{/if}
