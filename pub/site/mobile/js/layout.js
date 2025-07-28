
//S:검색창
const searchButton = document.querySelector(".search");
const searchForm = document.querySelector(".search-form");
const searchCloseButton = document.querySelector(".search-form .btn-close");

searchButton.addEventListener("click", function() {
	searchForm.classList.add("on");
	searchForm.querySelector("input").focus();
});

searchCloseButton.addEventListener("click", function() {
	searchForm.classList.remove("on");
});
//E:검색창

//S:메뉴오픈
const menuButtons = document.querySelectorAll("nav#dock .menu, .sboard-btn a");
const allMenuM = document.querySelector("#allMenu");
const menuCloseButton = document.querySelector("#allMenu .btn-close");



// 클릭 이벤트 리스너를 추가
menuButtons.forEach(button => {
	button.addEventListener('click', () => {
		allMenuM.classList.add("on");

		// "on" 클래스명을 가진 ul 요소 확인
		const ulElementsWithOnClass = document.querySelectorAll(".menu-box h3 + ul.on");

		if (ulElementsWithOnClass.length === 0) {

			// 첫 번째 h3 태그 내의 a 태그에 클래스 추가
			document.querySelector(".menu-box>ul>li:first-child h3 a").classList.add("active");

			// 첫 번째 h3 태그 뒤의 ul 태그에 클래스 추가
			document.querySelector(".menu-box>ul>li:first-child h3 + ul").classList.add("on");
		}
	});
});


menuCloseButton.addEventListener("click", function() {
	allMenuM.classList.remove("on");
});
//E:메뉴오픈

//S:하위메뉴
document.addEventListener("DOMContentLoaded", function () {
	const menuHeadings = document.querySelectorAll("#allMenu ul h3 a");
	const subMenuLinks = document.querySelectorAll("#allMenu ul ul a");
	const allMenuItems = document.querySelectorAll("#allMenu ul li");

	menuHeadings.forEach(menuHeading => {
		menuHeading.addEventListener("click", handleMenuClick);
	});

	subMenuLinks.forEach(subMenuLink => {
		subMenuLink.addEventListener("click", handleSubMenuClick);
	});

	allMenuItems.forEach(menuItem => {
		if (menuItem.querySelector("ul")) {
			menuItem.querySelector("a").classList.add("has");
		} else {
			// If there's no sub-menu, add a click event to navigate to the link
			const link = menuItem.querySelector("a");
			link.addEventListener("click", () => {
				window.location.href = link.getAttribute("href");
			});
		}
	});

	function handleMenuClick(e) {
		e.preventDefault();

		// if (this.getAttribute('href') === '/menu1204.htm') {
		// 	window.location.href = '/menu1204.htm';
		// }


		const submenu = this.parentElement.parentElement.querySelector("ul");
		const otherSubmenus = document.querySelectorAll("ul ul");

		otherSubmenus.forEach(sub => {
			sub.classList.remove('on');
		});

		submenu.classList.add('on');

		menuHeadings.forEach(heading => {
			heading.classList.remove("active");
		});

		this.classList.add("active");
	}

	function handleSubMenuClick(e) {
		e.preventDefault();
		const submenu = this.parentElement.querySelector("ul");
		const otherSubmenus = this.parentElement.parentElement.querySelectorAll("ul ul");
		const parentMenu = this.parentElement;
		const hasSubMenu = parentMenu.querySelector("ul ul");


		if (hasSubMenu) {
			otherSubmenus.forEach(sub => {
				sub.classList.remove('on');
			});

			submenu.classList.add('on');

			subMenuLinks.forEach(link => {
				link.classList.remove("active");
			});

			this.classList.add("active");
		}
	}
});


//E:하위메뉴


//S:언어선택

const langButton = document.querySelector("nav#allMenu button.language");
const lang = document.querySelector("nav#allMenu div.language");

langButton.addEventListener("click", function() {
	lang.classList.toggle("on");
});

//E:언어선택



//S:메인 게시물 탭

// 모든 h3 요소에 클릭 이벤트 핸들러 등록
document.querySelectorAll(".bbs .tabs button").forEach(function(h3) {
	h3.addEventListener("click", function() {
		// 현재 활성 클래스를 삭제
		document.querySelectorAll(".bbs .tabs button").forEach(function(item) {
			item.classList.remove("active");
		});

		// 클릭된 h3 요소에 활성 클래스 추가
		this.classList.add("active");

		// 모든 .tab-data 요소에 활성 클래스를 삭제
		document.querySelectorAll(".bbs .tab-data").forEach(function(tabData) {
			tabData.classList.remove("active");
		});

		// 클릭된 h3 요소의 데이터 속성을 사용하여 해당 .tab-data에 활성 클래스 추가
		const dataAttribute = this.getAttribute("data-target");
		document.querySelector(".bbs .tab-data." + dataAttribute).classList.add("active");
	});
});

//E:메인 게시물 탭


//S:중앙도서관
document.addEventListener("DOMContentLoaded", function() {
	var openPopButton = document.querySelector('.open-pop');
	var dockLibrary = document.querySelector('.dock-library');
	var closeButtonElements = dockLibrary.querySelectorAll('button, a');



	openPopButton.addEventListener('click', function() {
		dockLibrary.classList.add('on');
	});



	// 각 closeButton 요소에 대해 이벤트 리스너를 추가하기 위해 forEach를 사용합니다.
	closeButtonElements.forEach(function(closeButton) {
		closeButton.addEventListener('click', function() {
			dockLibrary.classList.remove('on');
		});
	});
});
//E:중앙도서관