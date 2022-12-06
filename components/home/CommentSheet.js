import React, { forwardRef, useRef, useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { InterText, WorkSansText } from '../CustomText'
import { AntDesign } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { debounce } from 'lodash'

import ListSeparator from '../ListSeparator'
import { getComments, likeComment, likeReply, postComment, postReply, unlikeComment, unlikeReply } from '../../apis/article'

const defaultAvatarIcon = require('../../assets/images/Home/default-avatar.png')
const like = require('../../assets/images/Home/like.png')
const likeLiked = require('../../assets/images/Home/like-liked.png')
const commentsEmpty = require('../../assets/images/Home/comments-empty.png')

const pageSize = 10

const CommentSheet = forwardRef((props, ref) => {
  const { articleId, comments, setComments, incrementComment, commentCount, isLoggedIn } = props
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const [input, setInput] = useState('')
  const [replyCommentIndex, setReplyCommentIndex] = useState(-1)

  const [isReplying, setIsReplying] = useState(false)
  const [replyName, setReplyName] = useState('')

  const [showLoader, setShowLoader] = useState(false)

  const isScrolledBottom = useRef(false)
  const inputRef = useRef()

  const likeCommentPressed = async (index) => {
    if (!comments[index].liked) {
      setComments(prev => prev.map((c, i) => {
        if (i === index) {
          return { ...c, liked: true }
        }
        return c
      }))
      likeComment(comments[index]._id).catch((e) => {
        console.log(e)
        Toast.show({ type: 'error', text1: t('read.error1') })
        setComments(prev => prev.map((c, i) => {
          if (i === index) {
            return { ...c, liked: false }
          }
          return c
        }))
      })
    } else {
      setComments(prev => prev.map((c, i) => {
        if (i === index) {
          return { ...c, liked: false }
        }
        return c
      }))
      unlikeComment(comments[index]._id).catch((e) => {
        console.log(e)
        Toast.show({ type: 'error', text1: t('read.error1') })
        setComments(prev => prev.map((c, i) => {
          if (i === index) {
            return { ...c, liked: true }
          }
          return c
        }))
      })
    }
  }

  const likeReplyPressed = (commentIndex, replyIndex) => {
    if (!comments[commentIndex].replies[replyIndex].liked) {
      setComments(prev => prev.map((c, i) => {
        if (i === commentIndex) {
          return { ...c, replies: c.replies.map((r, j) => {
            if (j === replyIndex) {
              return { ...r, liked: true }
            }
            return r
          })}
        }
        return c
      }))
      likeReply(comments[commentIndex].replies[replyIndex]._id).catch((e) => {
        console.log(e)
        Toast.show({ type: 'error', text1: t('read.error1') })
        setComments(prev => prev.map((c, i) => {
          if (i === commentIndex) {
            return { ...c, replies: c.replies.map((r, j) => {
              if (j === replyIndex) {
                return { ...r, liked: false }
              }
              return r
            })}
          }
          return c
        }))
      })
    } else {
      setComments(prev => prev.map((c, i) => {
        if (i === commentIndex) {
          return { ...c, replies: c.replies.map((r, j) => {
            if (j === replyIndex) {
              return { ...r, liked: false }
            }
            return r
          })}
        }
        return c
      }))
      unlikeReply(comments[commentIndex].replies[replyIndex]._id).catch((e) => {
        console.log(e)
        Toast.show({ type: 'error', text1: t('read.error1') })
        setComments(prev => prev.map((c, i) => {
          if (i === commentIndex) {
            return { ...c, replies: c.replies.map((r, j) => {
              if (j === replyIndex) {
                return { ...r, liked: true }
              }
              return r
            })}
          }
          return c
        }))
      })
    }
  }

  const selectReply = (i) => {
    setReplyCommentIndex(i)
    inputRef.current.focus()
  }

  const cancelReply = () => {
    setReplyCommentIndex(-1)
    setReplyName('')
    inputRef.current.blur()
  }

  const commentArticle = async () => {
    setIsReplying(true)
    try {
      if (replyCommentIndex < 0) {
        const result = await postComment(articleId, input)
        const newComment = result.data.data
        setComments(prev => [newComment, ...prev])
        setInput('')
        incrementComment()
        inputRef.current.blur()
      } else {
        const result = await postReply(comments[replyCommentIndex]._id, input)
        const newComment = result.data.data
        setComments(prev => prev.map((c, i) => {
          if (i === replyCommentIndex) {
            if (c.replies && Array.isArray(c.replies)) {
              const replies = [...c.replies, newComment]
              return { ...c, replies }
            } else {
              return { ...c, replies: [newComment] }
            }
          }
          return c
        }))
        setInput('')
        setReplyCommentIndex(-1)
        inputRef.current.blur()
      }
    } catch (e) {
      console.log(e)
      Toast.show({ type: 'error', text1: t('read.error4') })
    } finally {
      setIsReplying(false)
    }
  }

  const onMomentumScrollEnd = async () => {
    setShowLoader(true)
    _debounce(() => {
      if (isScrolledBottom.current) {
        isScrollToBottom.current = false
        getComments(articleId, isLoggedIn, Math.trunc(comments.length / pageSize) + 1)
          .then(result => {
            setShowLoader(false)
            setComments(prev => {
              let arr = [...prev, ...result.data.data];
              return arr.filter(
                (v, i, a) => a.findIndex(v2 => v2._id === v._id) === i,
              );
            });
          })
      }
    })
  }

  const close = () => {
    setReplyCommentIndex(-1)
  }

  const renderMessageItem = ({ item, index }) => {
    const avatarUrl = defaultAvatarIcon

    return (
      <View key={item._id} style={{ paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <Image source={avatarUrl} style={{ height: 40, width: 40, borderRadius: 20 }} />
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
              {item.user.userName}
            </InterText>
            <InterText style={{ fontSize: 12, color: '#6R7C87' }}>
              {moment(new Date(item.createTime)).fromNow()}
            </InterText>
          </View>
          {/* <TouchableOpacity>
            <AntDesign name="ellipsis1" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
        <InterText style={{ lineHeight: 20, fontSize: 14, color: '#48535B' }}>
          {item.content}
        </InterText>
        { isLoggedIn ?
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
            <TouchableOpacity
              disabled={!isLoggedIn}
              onPress={() => likeCommentPressed(index)}
              style={{ opacity: isLoggedIn ? 1 : 0.3 }}
            >
              <Image source={item.liked ? likeLiked : like} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => {
                setReplyName(item.user.userName)
                selectReply(index)}
              }
              disabled={!isLoggedIn}
              style={{ opacity: isLoggedIn ? 1 : 0.3 }}
            >
              <InterText weight={500} style={{ fontSize: 14, color: '#1A2024' }}>
                {t('read.reply')}
              </InterText>
            </TouchableOpacity>
          </View> : null
        }
        { (item.replies && item.replies.length > 0) ?
          <>
            {item.replies.map((reply, index2) =>
              renderReplyItem(reply, index, index2)
            )}
            <View style={{ height: 16 }} />
          </> : null
        }
      </View>
    )
  }

  const renderReplyItem = (item, commentIndex, replyIndex) => {
    const avatarUrl = defaultAvatarIcon

    return (
      <View key={item._id} style={{ borderLeftColor: '#EEF0F2', borderLeftWidth: 1, paddingLeft: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
          <Image source={avatarUrl} style={{ height: 40, width: 40, borderRadius: 20 }} />
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
              {item.user.userName}
            </InterText>
            <InterText style={{ fontSize: 12, color: '#6R7C87' }}>
              {moment(new Date(item.createTime)).fromNow()}
            </InterText>
          </View>
          {/* <TouchableOpacity>
            <AntDesign name="ellipsis1" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
        <InterText style={{ lineHeight: 20, fontSize: 14, color: '#48535B' }}>
          {item.content}
        </InterText>
        { isLoggedIn ?
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
            <TouchableOpacity
              disabled={!isLoggedIn}
              onPress={() => likeReplyPressed(commentIndex, replyIndex)}
              style={{ opacity: isLoggedIn ? 1 : 0.3 }}
            >
              <Image source={item.liked ? likeLiked : like} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => {
                setReplyName(item.user.userName)
                selectReply(commentIndex)
              }}
              disabled={!isLoggedIn}
              style={{ opacity: isLoggedIn ? 1 : 0.3 }}
            >
              <InterText weight={500} style={{ fontSize: 14, color: '#1A2024' }}>
                {t('read.reply')}
              </InterText>
            </TouchableOpacity>
          </View> : null
        }
      </View>
    )
  }

  return (
    <RBSheet
      ref={ref}
      customStyles={{ container: { ...styles.sheetContainer, marginTop: insets.top }}}
      animationType="slide"
      // keyboardAvoidingViewEnabled
      onClose={close}
    >
      <View style={{ height: '100%', paddingBottom: insets.bottom }}>
        <View style={styles.sheetHeader}>
          <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
            {t('read.totalComments', { amount: commentCount })}
          </InterText>
          <TouchableOpacity
            onPress={() => ref.current.close()}
            style={{ position: 'absolute', right: 20 }}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        { comments.length > 0 ?
          <FlatList
            data={comments}
            renderItem={renderMessageItem}
            ItemSeparatorComponent={() => <ListSeparator />}
            onScroll={({nativeEvent}) => {
              isScrolledBottom.current = isScrollToBottom(nativeEvent);
            }}
            onMomentumScrollEnd={onMomentumScrollEnd}
            ListFooterComponent={() =>
              <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                { showLoader ? <ActivityIndicator color="#0E73F6" /> : null }
              </View>
            }
          /> :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Image source={commentsEmpty} />
            <WorkSansText weight={700} style={{ fontSize: 22, color: '#303940', marginBottom: 12 }}>
              {t('read.noComment1')}
            </WorkSansText>
            <InterText style={{ textAlign: 'center', fontSize: 14, color: '#303940', lineHeight: 20 }}>
              {t('read.noComment2')}
            </InterText>
          </View>
        }
        { replyCommentIndex >= 0 ?
          <Pressable onPress={cancelReply}>
            <View style={styles.replying}>
              <InterText weight={600} style={{ flex: 1, fontSize: 16, color: '#1A2024' }}>
                {t('read.replying')}: {replyName}
              </InterText>
              <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
                {t('word.cancel')}
              </InterText>
            </View>
          </Pressable> : null
        }
        { isLoggedIn ?
          <View style={styles.inputWrapper}>
            <TextInput
              value={input}
              onChangeText={setInput}
              style={styles.input}
              placeholder={t('read.comment')}
              placeholderTextColor="#84919A"
              multiline
              ref={inputRef}
            />
            <TouchableOpacity
              style={[styles.send, { opacity: isLoggedIn && !isReplying && input ? 1 : 0.2 }]}
              onPress={commentArticle}
              disabled={!isLoggedIn || isReplying || input.length === 0}
            >
              <>
                <AntDesign name="arrowup" size={24} color="white" />
                { isReplying ?
                  <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color="#0E73F6" />
                  </View> : null
                }
              </>
            </TouchableOpacity>
          </View> : null
        }
      </View>
    </RBSheet>
  )
})

const isScrollToBottom = nativeEvent => {
  const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
};

const _debounce = debounce((callback) => {
  callback()
}, 500)

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 'auto',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 16,
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    paddingLeft: 12,
    paddingRight: 5,
    minHeight: 64,
  },
  send: {
    height: 40,
    width: 40,
    borderRadius: 4,
    backgroundColor: '#0E73F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
    marginTop: 12,
  },
  replying: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8F9',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
})

export default CommentSheet
