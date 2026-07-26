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