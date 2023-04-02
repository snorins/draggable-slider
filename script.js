const cardContainer = document.querySelector('.card-container');
const cards = document.querySelectorAll('.card');

let mouseDown = false;
let mouseDownLastPositionX = 0;
let cardContainerTransformX = 0;
let mouseMoveLastXPosition = 0;


cards.forEach((card, index) => {
    card.addEventListener('focus', (event) => {
        const isFocusedWithKeyboard = event.target.matches(':focus-visible');
        // isFocusedWithKeyboard && card.scrollIntoView({ inline: 'center', behavior: 'smooth' });

        const cardIndex = index ?? index + 1;
        const cardContainerGap = parseInt(window.getComputedStyle(cardContainer).getPropertyValue('margin'));
        let translateValueX = cardIndex * (card.clientWidth + cardContainerGap - 64)

        // Don't allow to drag out ouf right side bounds.
        const rightSideFurthestCoordinates = cardContainer.offsetWidth - window.innerWidth;

        // Total card container side margin values.
        const cardContainerSideMargin = parseInt(window.getComputedStyle(cardContainer).getPropertyValue('margin')) * 2;

        const hasDraggedOutOfRightSideBounds = Math.abs(translateValueX) > rightSideFurthestCoordinates + cardContainerSideMargin;

        if (isFocusedWithKeyboard) {
            if (hasDraggedOutOfRightSideBounds) {
                translateValueX = rightSideFurthestCoordinates + cardContainerSideMargin;
            }

            cardContainer.style.transform = `translateX(${-translateValueX}px)`;
        }
    });
});

window.addEventListener('resize', () => handleDrag());

const handleMouseDown = (event) => {
    mouseDown = true;
    mouseDownLastPositionX = event.pageX;

    const cardContainerTransform = window.getComputedStyle(cardContainer).getPropertyValue('transform');

    if (cardContainerTransform !== 'none') {
        cardContainerTransformX = cardContainerTransform.split(',')[4].trim();
        cardContainerTransformX = parseInt(cardContainerTransformX);
    }
};

const handleMouseMove = (event) => {
    mouseDown && handleDrag(event.pageX);
    mouseMoveLastXPosition = event.pageX;
};

const handleMouseUp = () => mouseDown = false;

const handleDrag = (eventPageX = 0) => {
    let mouseMoveDifference = mouseDownLastPositionX;

    // When eventPageX is provided it means that the dragging action is being handled.
    // Otherwise, the window resize position reset is being handled.
    if (eventPageX) {
        mouseMoveDifference = eventPageX - mouseDownLastPositionX;
    }

    let translateValueX = mouseMoveDifference + cardContainerTransformX;

    // Don't allow to drag out ouf left side bounds.
    const hasDraggedOutOfLeftSideBounds = translateValueX > 0;
    if (hasDraggedOutOfLeftSideBounds) {
        translateValueX = 0;
    }

    // Don't allow to drag out ouf right side bounds.
    const rightSideFurthestCoordinates = cardContainer.offsetWidth - window.innerWidth;

    // Total card container side margin values.
    const cardContainerSideMargin = parseInt(window.getComputedStyle(cardContainer).getPropertyValue('margin')) * 2;

    const hasDraggedOutOfRightSideBounds = Math.abs(translateValueX) > rightSideFurthestCoordinates + cardContainerSideMargin;
    if (hasDraggedOutOfRightSideBounds) {
        // The value when dragging left is negative, so it needs to be converted negative here as well.
        translateValueX = -(rightSideFurthestCoordinates + cardContainerSideMargin);
    }

    cardContainer.style.transform = `translateX(${translateValueX}px)`;
}


if (window.PointerEvent) {
    cardContainer.addEventListener('pointerdown', handleMouseDown);
    cardContainer.addEventListener('pointermove', handleMouseMove);
    cardContainer.addEventListener('pointerup', handleMouseUp);
    cardContainer.addEventListener('pointerleave', handleMouseUp);
} else {
    cardContainer.addEventListener('mousedown', handleMouseDown);
    cardContainer.addEventListener('mousemove', handleMouseMove);
    cardContainer.addEventListener('mouseup', handleMouseUp);
    cardContainer.addEventListener('mouseleave', handleMouseUp);
}

