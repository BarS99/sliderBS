    class sliderBs {
        constructor(slider) {
            this.slider = document.getElementById(slider);
            this.track = this.slider.querySelector('.track');
            this.slides = this.slider.querySelectorAll('.slide');
            this.draggingEnabled = false;
            this.currentPosition = 0;
            this.prevPosition = 0;
            this.startCursorValue = 0;
            this.slidesTotalWidth = 0;
            this.clickStartPosition = 0;

            this.slider.classList.add('sliderBS');

            this.slides.forEach((item, index) => {
                this.slidesTotalWidth += item.getBoundingClientRect().width;
                item.setAttribute("data-index", index);
            });

            // bind events
            this.slider.addEventListener("mousedown", this.handleStart);
            this.slider.addEventListener("mouseup", this.handleEnd);
            this.slider.addEventListener("mouseleave", this.handleEnd);
            this.slider.addEventListener("mousemove", this.handleMove);

            this.slider.addEventListener("touchstart", this.handleStart);
            this.slider.addEventListener("touchend", this.handleEnd);
            this.slider.addEventListener("touchmove", this.handleMove);

            this.slides.forEach((item) => {
                item.addEventListener("click", (e) => {
                    this.handleClick(e, item);
                });
            });
        }

        // handlers

        handleStart = (e) => {
            this.clickStartPosition = [e.pageX, e.pageY];
            this.draggingEnabled = true;
            this.startCursorValue = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        }

        handleEnd = () => {
            this.draggingEnabled = false;
            this.prevPosition = this.currentPosition;
        }

        handleMove = (e) => {
            e.preventDefault();
            if (this.draggingEnabled) {
                this.currentPosition = this.prevPosition + (e.type.includes("mouse") ? e.pageX : e.touches[0].clientX) - this.startCursorValue;

                this.setPosition(this.slider, this.currentPosition, this.slidesTotalWidth, this.track);
            }
        }

        handleClick = (e, item) => {
            if (e.pageX !== this.clickStartPosition[0] || e.pageY !== this.clickStartPosition[1]) return;

            this.goTo(item, 1000);
        }

        // utilities

        goTo = (_item, _speed) => {
            this.slider.classList.add("sliderBS--block");
            let position = -(_item.offsetLeft - this.slider.getBoundingClientRect().width / 2 + _item.getBoundingClientRect().width / 2);
            if (position > 0) position = 0;
            else if (-position + this.slider.getBoundingClientRect().width > this.slidesTotalWidth) position = -(this.slidesTotalWidth - this.slider.getBoundingClientRect().width);
            this.prevPosition = position;
            this.currentPosition = position;
            this.track.style.transition = `transform ${_speed}ms`;
            this.track.style.transform = `translateX(${position}px)`;

            setTimeout(() => {
                this.slider.classList.remove("sliderBS--block");
                this.track.style.transition = `transform 0ms`;
            }, _speed);
        }

        setPosition = (slider, position, totalWidth, target) => {
            position = this.checkCollision(slider, position, totalWidth);

            target.style.transform = `translateX(${position}px)`;
            this.currentPosition = position;
        }

        checkCollision = (slider, position, totalWidth) => {
            if (position > 0) {
                position = 0;
            } else if (-position + slider.getBoundingClientRect().width > totalWidth) {
                position = -(totalWidth - slider.getBoundingClientRect().width);
            }

            return position;
        }
    }