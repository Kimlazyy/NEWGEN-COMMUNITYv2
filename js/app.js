// โหลดหน้า

async function loadPage(page){

    const content = document.querySelector(".content");

    content.style.opacity = "0";

    try{

        const res = await fetch(`pages/${page}.html`);

        if(!res.ok){
            throw new Error();
        }

        const html = await res.text();

        content.innerHTML = html;

        generateTOC();

        document.title = "NEWGEN | " + page;

    }

    catch{

        content.innerHTML = `
            <h1>404</h1>
            <p>ไม่พบหน้า ${page}</p>
        `;

    }

    content.style.opacity = "1";

}
// คลิกเมนู

document.querySelectorAll("[data-page]").forEach(item=>{

    item.addEventListener("click",()=>{

        document.querySelectorAll("[data-page]").forEach(menu=>{

            menu.classList.remove("active");

        });

        item.classList.add("active");

        loadPage(item.dataset.page);

    });

});

// โหลดหน้าแรก

loadPage("guide");
// =====================
// Search Menu
// =====================

const search = document.getElementById("search");

search.addEventListener("input", () => {

    const keyword = search.value.trim().toLowerCase();

    document.querySelectorAll(".menu-item").forEach(item => {

        const text = item.textContent.toLowerCase();

        item.style.display = text.includes(keyword) ? "" : "none";

    });

    document.querySelectorAll(".dropdown").forEach(dropdown => {

        const items = dropdown.querySelectorAll(".menu-item");

        let hasVisible = false;

        items.forEach(item => {

            if(item.style.display !== "none"){
                hasVisible = true;
            }

        });

        dropdown.style.display = hasVisible ? "" : "none";

    });

    if(keyword === ""){

        document.querySelectorAll(".menu-item").forEach(item=>{

            item.style.display = "";

        });

        document.querySelectorAll(".dropdown").forEach(dropdown=>{

            dropdown.style.display = "";

        });

    }

});
// =====================
// Dropdown Menu
// =====================

document.querySelectorAll(".dropdown-header").forEach(header => {

    header.addEventListener("click", () => {

        const dropdown = header.parentElement;

        dropdown.classList.toggle("open");

    });

});
// =====================
// Generate TOC
// =====================

function generateTOC(){

    const toc = document.getElementById("toc-list");

    if(!toc) return;

    toc.innerHTML = "";

    const headings = document.querySelectorAll(".content h2");

    headings.forEach((heading,index)=>{

        heading.id = "section-" + index;

        const li = document.createElement("li");

        const a = document.createElement("a");

        a.href = "#" + heading.id;

        a.textContent = heading.textContent;

        li.appendChild(a);

        toc.appendChild(li);

    });

}
const searchPages = [
    { page: "guide", title: "คำแนะนำการเล่น" },
    { page: "rules", title: "กฎทั่วไป" },
    { page: "report", title: "การแจ้งปัญหา" },
    { page: "event", title: "กฎกิจกรรม" },

    { page: "police1", title: "กฎตำรวจ 1" },
    { page: "police2", title: "กฎตำรวจ 2" },
    { page: "police3", title: "กฎตำรวจ 3" },
    { page: "police4", title: "กฎตำรวจ 4" },
    { page: "police5", title: "กฎตำรวจ 5" },

    { page: "council1", title: "กฎสภา 1" },
    { page: "council2", title: "กฎสภา 2" },
    { page: "council3", title: "กฎสภา 3" }
];
// =====================
// Search Content
// =====================

// =====================
// Live Search
// =====================

const searchInput = document.getElementById("search");
const resultBox = document.getElementById("search-results");

searchInput.addEventListener("input", async () => {

    const keyword = searchInput.value.trim().toLowerCase();

    resultBox.innerHTML = "";

    if(keyword.length < 2){

        resultBox.style.display = "none";
        return;

    }

    for(const item of searchPages){

        const res = await fetch(`pages/${item.page}.html`);
        const html = await res.text();

        const text = html.replace(/<[^>]*>/g," ");

        if(text.toLowerCase().includes(keyword)){

            const div = document.createElement("div");

            div.className = "search-result";

            div.innerHTML = `
                <b>${item.title}</b><br>
                <small>${keyword}</small>
            `;

            div.onclick = ()=>{

                loadPage(item.page);

                resultBox.style.display="none";

                searchInput.value="";

                setTimeout(()=>{

                    const elements=document.querySelectorAll(".content li,.content p,.content h1,.content h2,.content h3");

                    elements.forEach(el=>{

                        if(el.textContent.toLowerCase().includes(keyword)){

                            el.scrollIntoView({
                                behavior:"smooth",
                                block:"center"
                            });

                            el.style.background="#ffe66d";
                            el.style.color="#000";

                            setTimeout(()=>{

                                el.style.background="";
                                el.style.color="";

                            },3000);

                        }

                    });

                },300);

            };

            resultBox.appendChild(div);

        }

    }

    resultBox.style.display =
        resultBox.children.length ? "block" : "none";

});

document.addEventListener("click",(e)=>{

    if(!e.target.closest(".header-center")){

        resultBox.style.display="none";

    }

});