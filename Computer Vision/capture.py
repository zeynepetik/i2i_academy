from time import time

import mediapipe as mp
import cv2

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

cap=cv2.VideoCapture(0) #for webcam 0
width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)

with mp_hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)as hands:
    while True:
        attempt=0
        #check if the webcam is opened correctly and read the image
        sucess, img=cap.read()
        #attempt to give chance for webcam to open and read the image
        while not sucess and attempt<5:
            time.sleep(0.2)
            sucess, img=cap.read()
            attempt+=1
        
        if not sucess:
            print("Failed to read the webcam")
            break

        img_height, img_width, _ = img.shape
        rgb=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        results=hands.process(rgb)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    img,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS
                )

                finger_tips ={
                    "thumb":hand_landmarks.landmark[4],
                    "index":hand_landmarks.landmark[8],
                    "middle":hand_landmarks.landmark[12],
                    "ring":hand_landmarks.landmark[16],
                    "pinky":hand_landmarks.landmark[20]
                }

                for name, landmark in finger_tips.items():
                    x = int(landmark.x * img_width)
                    y = int(landmark.y * img_height)
                    cv2.putText(img,
                                 name,
                                   (x-25,y-25), #to put hte text slightly above the finger
                                     cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,0,0), 1)
                    
                lm=hand_landmarks.landmark
                fingers=[]
                handedness=results.multi_handedness[0].classification[0].label
                if handedness=="Right":
                    fingers.append(1 if lm[4].x<lm[3].x else 0)#right thumb
                else:
                    fingers.append(1 if lm[4].y<lm[3].y else 0)#left thumb
                
                #other fingers
                for id in range(1,5):
                    tip=finger_tips[list(finger_tips.keys())[id]]
                    pip_joint=tip-2
                    fingers.append(1 if lm[tip].y<lm[pip_joint].y else 0)

        img=cv2.flip(img,1) #flip the image horizontally/ mirrored version of the hands
        cv2.imshow("Image",img)

        if cv2.waitKey(1) & 0xFF==ord('q'):
            break

cap.release()
cv2.destroyAllWindows()