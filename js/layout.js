$(document).ready(function () {
  //preload
  $(window).load(function () {
    // makes sure the whole site is loaded
    $("#status").fadeOut(); // will first fade out the loading animation
    $("#preloader").delay(350).fadeOut("slow", function () {
      // The SVG begins animating while the preloader is still covering it.
      // Reload it after the mask is gone so visitors see the animation from frame zero.
      var hero = document.querySelector(".head_visual[data-animation-src]");
      if (hero) {
        var heroSrc = hero.getAttribute("data-animation-src");
        var joiner = heroSrc.indexOf("?") === -1 ? "?" : "&";
        var sourceAttribute = hero.tagName.toLowerCase() === "object" ? "data" : "src";
        hero.setAttribute(sourceAttribute, heroSrc + joiner + "play=" + Date.now());
      }
    }); // will fade out the white DIV that covers the website.
    $("body").delay(350).css({ overflow: "visible" });
  });

  function resize_layout() {
    var window_width = $(window).outerWidth();
    var window_height = $(window).outerHeight();

    $("#width_num").html(window_width);
    $("#height_num").html(window_height);

    // $("#KV").height(window_height);

    if (480 < window_width) {
      $(".rplc_img").each(function () {
        var chg_img = $(this).attr("datapc");
        $(this).attr("src", chg_img);
      });
    } else {
      $(".rplc_img").each(function () {
        var chg_img = $(this).attr("datamb");
        $(this).attr("src", chg_img);
      });
    }
  }

  /**init**/
  resize_layout();

  /**resize**/
  $(window).resize(function () {
    resize_layout();
  });

  //goTop

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".goTop").fadeIn();
    } else {
      $(".goTop").fadeOut();
    }
  });

  //Click event to scroll
  $(".goTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 800);
    return false;
  });

  // $(".kv_img").imagesLoaded(function () {
  //   $(".kv_img").imagefill();
  // });

  var sec1_slider = $("#speaker_slider").lightSlider({
    item: 4,
    loop: false,
    adaptiveHeight: true,
    controls: false,
    pager: true,
    auto: false,
    enableTouch: false,
    enableDrag: false,
    slideMargin: 0,
    speed: 1000,
    pause: 4000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          item: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          item: 2,
          slideMargin: 0,
          enableTouch: true,
          enableDrag: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          item: 1,
          slideMargin: 0,
          enableTouch: true,
          enableDrag: true,
        },
      },
    ],
  });

  $(".s_left_arrow").click(function () {
    sec1_slider.goToPrevSlide();
  });

  $(".s_right_arrow").click(function () {
    sec1_slider.goToNextSlide();
  });

  //rwd menu

  $(".scroll_btn").click(function () {
    var ta_value = $(this).attr("data");
    $("html,body").animate({ scrollTop: $(ta_value).offset().top }, 800);
    $("#NAV").toggleClass("reveal");
    $("#nav-icon3").toggleClass("open");
  });

  $(".btn_scroll").click(function () {
    var ta_value = $(this).attr("data");
    $("html,body").animate({ scrollTop: $(ta_value).offset().top }, 800);
  });

  $(".NAV_btn_wrap").on("click", function (e) {
    e.stopPropagation();
    $("#NAV").toggleClass("reveal");
    $("#nav-icon3").toggleClass("open");
  });

  $(".speaker_item").on("click", function (e) {
    e.stopPropagation();
    var ta_cover = $(this).find(".cover").attr("src");
    var ta_name = $(this).find(".name").html();
    var ta_title = $(this).find(".title").html();
    var ta_Jb_txt = $(this).attr("dataJb");
    var ta_Ski_txt = $(this).attr("dataSki");
    var ta_Exp_txt = $(this).attr("dataExp");
    var ta_des_txt = "";

    $("#speaker_box_cover").attr("src", ta_cover);
    $("#speaker_box_name").html(ta_name);
    $("#speaker_box_title").html(ta_title);

    if (ta_Jb_txt) {
      ta_Jb_txt = ta_Jb_txt.replace(/^/, "<span>現任</span><br>");
      ta_des_txt += ta_Jb_txt + "<br>";
    }

    if (ta_Ski_txt) {
      ta_Ski_txt = ta_Ski_txt.replace(/^/, "<span>專長</span><br>");
      ta_des_txt += ta_Ski_txt + "<br>";
    }

    if (ta_Exp_txt) {
      ta_Exp_txt = ta_Exp_txt.replace(/^/, "<span>經歷</span><br>");
      ta_des_txt += ta_Exp_txt;
    }

    $(".speaker_resume").html(ta_des_txt);
    $("#host_info_box").addClass("show");
  });

  $(".speaker_close").on("click", function (e) {
    e.stopPropagation();
    $("#speaker_box_cover").attr("src", "");
    $("#speaker_box_name").html("");
    $("#speaker_box_title").html("");
    $(".speaker_resume").html("");
    $("#host_info_box").removeClass("show");
  });

  // 2026 speaker stage interactions
  (function initSpeakerStage() {
    var section = document.querySelector(".speaker_bg");
    var stage = document.querySelector(".speaker_stage");
    if (!section || !stage) return;

    var cards = Array.prototype.slice.call(stage.querySelectorAll(".portrait_card"));
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var mobileQuery = window.matchMedia("(max-width: 640px)");
    var activeIndex = 0;
    var manualPauseUntil = 0;
    var scrollFrame = null;

    function revealStage() {
      stage.classList.add("is_visible");
      updateActiveCard();
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealStage();
            observer.disconnect();
          }
        });
      }, { threshold: 0.18 });
      observer.observe(stage);
    } else {
      revealStage();
    }

    function updateActiveCard() {
      if (!mobileQuery.matches || !cards.length) return;
      var stageCenter = stage.scrollLeft + stage.clientWidth / 2;
      var closestDistance = Infinity;
      cards.forEach(function (card, index) {
        var cardCenter = card.offsetLeft + card.offsetWidth / 2;
        var distance = Math.abs(stageCenter - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });
      cards.forEach(function (card, index) {
        card.classList.toggle("is_active", index === activeIndex);
      });
    }

    stage.addEventListener("scroll", function () {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(updateActiveCard);
    }, { passive: true });

    function pauseAutoplay() {
      manualPauseUntil = Date.now() + 6500;
    }

    stage.addEventListener("pointerdown", pauseAutoplay, { passive: true });
    stage.addEventListener("touchstart", pauseAutoplay, { passive: true });

    if (!reduceMotion) {
      window.setInterval(function () {
        if (!mobileQuery.matches || Date.now() < manualPauseUntil || !cards.length) return;
        activeIndex = (activeIndex + 1) % cards.length;
        var nextCard = cards[activeIndex];
        var targetLeft = nextCard.offsetLeft - (stage.clientWidth - nextCard.offsetWidth) / 2;
        stage.scrollTo({ left: targetLeft, behavior: "smooth" });
      }, 3000);
    }

    if (finePointer && !reduceMotion) {
      section.addEventListener("pointermove", function (event) {
        var bounds = section.getBoundingClientRect();
        var x = ((event.clientX - bounds.left) / bounds.width) * 100;
        var y = ((event.clientY - bounds.top) / bounds.height) * 100;
        section.style.setProperty("--spot-x", x.toFixed(1) + "%");
        section.style.setProperty("--spot-y", y.toFixed(1) + "%");
      });

      section.addEventListener("pointerleave", function () {
        section.style.removeProperty("--spot-x");
        section.style.removeProperty("--spot-y");
      });

      cards.forEach(function (card) {
        var portrait = card.querySelector("img");
        card.addEventListener("pointermove", function (event) {
          var bounds = card.getBoundingClientRect();
          var px = (event.clientX - bounds.left) / bounds.width;
          var py = (event.clientY - bounds.top) / bounds.height;
          var rotateY = (px - 0.5) * 11;
          var rotateX = (0.5 - py) * 9;
          card.style.transform = "perspective(900px) translateY(-8px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg)";
          if (portrait) {
            portrait.style.transform = "scale(1.09) translate(" + ((0.5 - px) * 8).toFixed(1) + "px," + ((0.5 - py) * 8).toFixed(1) + "px)";
          }
        });

        card.addEventListener("pointerleave", function () {
          card.style.transform = "";
          if (portrait) portrait.style.transform = "";
        });
      });
    }

    window.addEventListener("resize", updateActiveCard);
  })();

  // Reveal the agenda only when the user scrolls it into view.
  (function initAgendaReveal() {
    var agendaSection = document.getElementById("sec3");
    if (!agendaSection) return;

    var agendaRows = agendaSection.querySelectorAll(
      ".agenda_body > .agenda_body_item, .agenda_body > .agenda_gate"
    );

    agendaSection.classList.add("agenda_motion");
    Array.prototype.forEach.call(agendaRows, function (row, index) {
      row.style.setProperty("--agenda-delay", (0.42 + index * 0.10).toFixed(2) + "s");
    });

    function revealAgenda() {
      agendaSection.classList.add("agenda_revealed");
    }

    if ("IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var agendaObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealAgenda();
            agendaObserver.disconnect();
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -15% 0px" });

      agendaObserver.observe(agendaSection);
    } else {
      revealAgenda();
    }
  })();

  //animate

  var wow = new WOW({
    boxClass: "wow", // 要套用WOW.js縮需要的動畫class(預設是wow)
    animateClass: "animated", // 要"動起來"的動畫(預設是animated, 因此如果你有其他動畫library要使用也可以在這裡調整)
    offset: 0, // 距離顯示多遠開始顯示動畫 (預設是0, 因此捲動到顯示時才出現動畫)
    mobile: true, // 手機上是否要套用動畫 (預設是true)
    live: true, // 非同步產生的內容是否也要套用 (預設是true, 非常適合搭配SPA)
    callback: function (box) {
      // 當每個要開始時, 呼叫這裡面的內容, 參數是要開始進行動畫特效的element DOM
    },
    scrollContainer: null, // 可以設定成只套用在某個container中捲動才呈現, 不設定就是整個視窗
  });
  wow.init();
});
