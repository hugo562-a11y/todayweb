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

  // Speaker photos open their bios; arrows browse the fixed-size carousel.
  function initSpeakerInteraction() {
    var speakerCards = document.querySelector(".speaker_cards");
    if (!speakerCards) return;
    window.setTimeout(function () {
      function positionSpeakerGlow(card, event) {
        if (!card || !event) return;
        var bounds = card.getBoundingClientRect();
        var x = Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100));
        var y = Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100));
        card.style.setProperty("--speaker-glow-x", x.toFixed(2) + "%");
        card.style.setProperty("--speaker-glow-y", y.toFixed(2) + "%");
      }

      speakerCards.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse") return;
        var card = event.target.closest(".speaker_card");
        if (!card) return;
        card.classList.add("is-hovered");
        positionSpeakerGlow(card, event);
      });

      speakerCards.addEventListener("pointerout", function (event) {
        var card = event.target.closest(".speaker_card");
        if (card && !card.contains(event.relatedTarget)) card.classList.remove("is-hovered");
      });

      speakerCards.addEventListener("click", function (event) {
        if (touchHasDragged) return;
        var photo = event.target.closest(".speaker_card > img");
        if (!photo) return;
        var card = photo.closest(".speaker_card");
        if (!card) return;
        event.preventDefault();
        event.stopPropagation();
        $("#speaker_box_cover").attr("src", card.querySelector("img").getAttribute("src"));
        $("#speaker_box_name").text(card.querySelector("h3").textContent);
        $("#speaker_box_title").text(card.querySelector(".speaker_copy > span").textContent);
        var bioData = card.querySelector(".speaker_bio_data");
        $(".speaker_resume").html(bioData ? bioData.innerHTML : "<span>現任</span><br>" + card.querySelector(".speaker_full").innerHTML);
        $("#host_info_box").addClass("show");
      });

      var touchStartX = 0;
      var touchStartScrollLeft = 0;
      var touchHasDragged = false;
      speakerCards.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
        touchStartScrollLeft = speakerCards.scrollLeft;
        touchHasDragged = false;
      }, { passive: true });
      speakerCards.addEventListener("touchmove", function (event) {
        var distance = event.touches[0].clientX - touchStartX;
        if (Math.abs(distance) < 4) return;
        touchHasDragged = true;
        speakerCards.scrollLeft = touchStartScrollLeft - distance;
        event.preventDefault();
      }, { passive: false });
      speakerCards.addEventListener("touchend", function () {
        window.setTimeout(function () { touchHasDragged = false; }, 0);
      });

      var cards = Array.prototype.slice.call(speakerCards.querySelectorAll(".speaker_card"));
      var dots = document.querySelector(".speaker_dots");
      var previousButton = document.querySelector(".speaker_nav--prev");
      var nextButton = document.querySelector(".speaker_nav--next");
      var activeIndex = 0;

      function setActiveSpeaker(index, shouldScroll) {
        activeIndex = Math.max(0, Math.min(cards.length - 1, index));

        if (shouldScroll) {
          speakerCards.scrollLeft = cards[activeIndex].offsetLeft;
        }

        dots.querySelectorAll(".speaker_dot").forEach(function (dot, dotIndex) {
          var isActive = dotIndex === activeIndex;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-current", isActive ? "true" : "false");
        });

        previousButton.hidden = activeIndex === 0;
        nextButton.hidden = activeIndex === cards.length - 1;
      }

      cards.forEach(function (card, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "speaker_dot";
        dot.setAttribute("aria-label", "第 " + (index + 1) + " 位講者");
        dot.addEventListener("click", function () {
          setActiveSpeaker(index, true);
        });
        dots.appendChild(dot);
      });

      previousButton.addEventListener("click", function () {
        setActiveSpeaker(activeIndex - 1, true);
      });

      nextButton.addEventListener("click", function () {
        setActiveSpeaker(activeIndex + 1, true);
      });

      setActiveSpeaker(0, false);
    }, 300);
  }
  initSpeakerInteraction();

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

  // Give each main section a soft halo as it enters the viewport.
  (function initSectionScrollGlow() {
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var sections = document.querySelectorAll("#sec1, #sec2, #sec3, #sec5");
    var glowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var section = entry.target;
        if (entry.isIntersecting) {
          section.classList.remove("scroll_glow");
          window.requestAnimationFrame(function () {
            if (section.isConnected) section.classList.add("scroll_glow");
          });
        } else {
          section.classList.remove("scroll_glow");
        }
      });
    }, { threshold: 0.18 });

    Array.prototype.forEach.call(sections, function (section) {
      glowObserver.observe(section);
    });
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
