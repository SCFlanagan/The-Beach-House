import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import InfoModal from "./InfoModal";
import { getUserConfig } from "../constants/universalFunctions";

function ReviewVoteBtns({ review }) {
  const [showModal, setShowModal] = useState(false);
  const [upVoteSelected, setUpVoteSelected] = useState(false);
  const [downVoteSelected, setDownVoteSelected] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const getReviewVote = useCallback(async () => {
    const { data } = await axios.get(
      `/api/reviews/${review.id}/vote/`,
      getUserConfig(userInfo)
    );
    if (data.id) {
      if (data.review_vote === "U") {
        setUpVoteSelected(true);
      } else if (data.review_vote === "D") {
        setDownVoteSelected(true);
      }
    }
  }, [review.id, setUpVoteSelected, setDownVoteSelected, userInfo]);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      getReviewVote();
    }
  }, [userInfo, getReviewVote]);

  const handleSelectUpVote = () => {
    setUpVoteSelected(true);
    setDownVoteSelected(false);
    selectVote("U");
  };

  const handleSelectDownVote = () => {
    setUpVoteSelected(false);
    setDownVoteSelected(true);
    selectVote("D");
  };

  const selectVote = async (vote) => {
    if (userInfo && Object.keys(userInfo).length) {
      await axios.post(
        `/api/reviews/${review.id}/vote/create/`,
        {
          user: userInfo.id,
          review: review.id,
          review_vote: vote,
        },
        getUserConfig(userInfo)
      );
    }
  };

  return (
    <div>
      <InfoModal
        title="Log In Required"
        message="You must be logged in to rate a review."
        showModal={showModal}
        closeModal={closeModal}
        isLogInModal={true}
      />
      {!Object.keys(userInfo).length || review.user === userInfo.id ? (
        <span>
          <p className="inline">{review.up_votes}</p>
          <h3 className="inline">
            {review.user !== userInfo.id ? (
              <span>
                <span>
                  <i
                    className="fa-regular fa-thumbs-up review-vote-btn"
                    onClick={() => setShowModal(true)}
                  ></i>
                </span>
                <span>
                  <i
                    className="fa-regular fa-thumbs-down review-vote-btn"
                    onClick={() => setShowModal(true)}
                  ></i>
                </span>
              </span>
            ) : (
              <span>
                <span>
                  <i className="fa-regular fa-thumbs-up review-vote-btn-no-hover"></i>
                </span>
                <span>
                  <i className="fa-regular fa-thumbs-down review-vote-btn-no-hover"></i>
                </span>
              </span>
            )}
          </h3>
          <p className="inline">{review.down_votes}</p>
        </span>
      ) : (
        <span>
          <p className="inline">
            {upVoteSelected ? review.up_votes + 1 : review.up_votes}
          </p>
          <h3 className="inline">
            {upVoteSelected ? (
              <span>
                <i className="fa-solid fa-thumbs-up review-vote-btn-no-hover "></i>
              </span>
            ) : (
              <span>
                <i
                  className="fa-solid fa-thumbs-up review-vote-btn fa-hover-show"
                  onClick={handleSelectUpVote}
                ></i>
                <i
                  className="fa-regular fa-thumbs-up review-vote-btn fa-hover-hidden"
                  onClick={handleSelectUpVote}
                ></i>
              </span>
            )}
            {downVoteSelected ? (
              <span>
                <i className="fa-solid fa-thumbs-down review-vote-btn"></i>
              </span>
            ) : (
              <span>
                <i
                  className="fa-solid fa-thumbs-down review-vote-btn fa-hover-show"
                  onClick={handleSelectDownVote}
                ></i>
                <i
                  className="fa-regular fa-thumbs-down review-vote-btn fa-hover-hidden"
                  onClick={handleSelectDownVote}
                ></i>
              </span>
            )}
          </h3>
          <p className="inline">
            {downVoteSelected ? review.down_votes + 1 : review.down_votes}
          </p>
        </span>
      )}
    </div>
  );
}

export default ReviewVoteBtns;
