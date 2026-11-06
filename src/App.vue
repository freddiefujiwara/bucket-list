<template>
  <div class="page">
    <nav class="site-nav">
      <a class="brand" href="https://freddiefujiwara.com/">藤原史和｜川口を歩くQAエンジニア</a>
      <ul>
        <li><a href="https://freddiefujiwara.com/">トップ</a></li>
        <li><a href="https://freddiefujiwara.com/#about">プロフィール</a></li>
        <li><a href="https://freddiefujiwara.com/#activity">活動・発信</a></li>
        <li><a href="https://freddiefujiwara.com/#contact">情報交換</a></li>
        <li><a href="https://freddiefujiwara.com/blog/">ブログ</a></li>
        <li><a href="https://freddiefujiwara.com/list-of-stuff/">持ち物</a></li>
      </ul>
    </nav>

    <header class="hero">
      <div class="hero-inner">
        <p class="hero-place">KAWAGUCHI — BUCKET LIST</p>
        <h1>
          <span class="h1-name">死ぬまでにやりたいことリスト</span>
          <span class="h1-role">人生で叶えたいことを、タイルでまとめて眺められます。</span>
        </h1>
      </div>
    </header>

    <main class="content">
      <section v-if="!isAuthenticated" class="login-gate">
        <h2>本人の目標管理ページです</h2>
        <p>
          このページは公開用ではなく、藤原本人がバケットリストを管理するためのものです。
          Googleアカウントでログインするか、発行された一時リンクから開いてください。
          公開版はブログ記事で読めます。
        </p>
        <p v-if="authNotice" class="auth-notice">{{ authNotice }}</p>
        <div
          class="google-button"
          :ref="(el) => { googleButtonRoot = el; }"
        />
        <p v-if="googleScriptError" class="auth-notice">
          Googleログインの読み込みに失敗しました。通信環境を確認して再読み込みしてください。
        </p>
      </section>

      <template v-else>
        <p v-if="error" class="state error">
          {{ error }}
          <button class="retry" type="button" @click="loadTiles">再読み込み</button>
        </p>
        <p v-else-if="loading" class="state">データを取得しています…</p>
        <template v-else>
          <div class="stats-row">
            <p class="stats">全{{ totalCount }}件（達成済み {{ completedCount }}件）</p>
            <button class="add-btn" type="button" @click="openAdd">＋ 項目を追加</button>
          </div>
          <FilterBar
            :categories="categoryOptions"
            :ages="ageOptions"
            :filters="filters"
            :shown-count="filteredTiles.length"
            @change="setFilter"
            @clear="clearFilters"
          />
          <p v-if="filteredTiles.length === 0" class="state">表示するデータがありません。</p>
          <TileGrid v-else :items="filteredTiles" @select="openTile" />
        </template>

        <SharePanel v-if="isOwner" :id-token="idToken" />
      </template>

      <div class="utility">
        <a href="https://freddiefujiwara.com/">トップへ戻る</a>
        <template v-if="isAuthenticated">
          <span class="sep">|</span>
          <button class="copy-btn" type="button" @click="copyTilesJson" :disabled="loading">
            コピー
          </button>
          <span v-if="copyDone" class="copy-done">コピー完了</span>
          <span class="sep">|</span>
          <button class="copy-btn logout-btn" type="button" @click="logout">
            ログアウト
          </button>
        </template>
      </div>

      <footer class="site-footer">
        <div class="foot-links">
          <a href="https://freddiefujiwara.com/">トップ <span class="arr">↗</span></a>
          <a href="https://freddiefujiwara.com/blog/">ブログ <span class="arr">↗</span></a>
          <a href="https://freddiefujiwara.com/list-of-stuff/">持ち物 <span class="arr">↗</span></a>
          <a href="https://www.instagram.com/freddiefujiwara" target="_blank" rel="noopener">Instagram <span class="arr">↗</span></a>
          <a href="https://www.facebook.com/freddiefujiwara" target="_blank" rel="noopener">Facebook <span class="arr">↗</span></a>
          <a href="https://www.google.com/maps/contrib/105456242747265663411/reviews" target="_blank" rel="noopener">Googleマップの口コミ <span class="arr">↗</span></a>
          <a href="https://review.travel.rakuten.co.jp/reviewer/fumikazufujiwara" target="_blank" rel="noopener">楽天トラベルの口コミ <span class="arr">↗</span></a>
          <a href="https://tabelog.com/rvwr/zegenvs/" target="_blank" rel="noopener">食べログの口コミ <span class="arr">↗</span></a>
          <a href="https://retty.me/user/50281/" target="_blank" rel="noopener">Rettyの口コミ <span class="arr">↗</span></a>
          <a href="https://x.com/freddiefujiwara" target="_blank" rel="noopener">X <span class="arr">↗</span></a>
          <a href="https://github.com/freddiefujiwara" target="_blank" rel="noopener">GitHub <span class="arr">↗</span></a>
          <a href="https://linkedin.com/in/freddiefujiwara" target="_blank" rel="noopener">LinkedIn <span class="arr">↗</span></a>
          <a href="https://youtrust.jp/users/freddiefujiwara" target="_blank" rel="noopener">YOUTRUST <span class="arr">↗</span></a>
          <a href="https://fril.jp/shop/freddiefujiwara" target="_blank" rel="noopener">ラクマ <span class="arr">↗</span></a>
        </div>
        <p class="copy">© {{ year }} 藤原史和（Fumikazu Fujiwara）— freddiefujiwara.com</p>
      </footer>
    </main>

    <TileModal
      v-if="selectedTile"
      :item="selectedTile"
      :has-prev="hasPrev"
      :has-next="hasNext"
      @close="closeTile"
      @prev="prevTile"
      @next="nextTile"
      @edit="openEdit"
    />

    <ItemEditor
      v-if="editorOpen"
      :item="editorItem"
      :categories="categoryNames"
      :saving="editorSaving"
      :error-message="editorError"
      @save="saveEditor"
      @delete="deleteEditor"
      @cancel="closeEditor"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import FilterBar from './components/FilterBar.vue';
import ItemEditor from './components/ItemEditor.vue';
import SharePanel from './components/SharePanel.vue';
import TileGrid from './components/TileGrid.vue';
import TileModal from './components/TileModal.vue';
import { useAuth } from './composables/useAuth';
import { useTiles } from './composables/useTiles';

const year = new Date().getFullYear();

const authNotice = ref('');

const {
  idToken,
  isAuthenticated,
  isOwner,
  authParams,
  googleScriptError,
  googleButtonRoot,
  logout
} = useAuth();

const handleAuthError = (message) => {
  authNotice.value = `ログインの有効期限が切れました。再度ログインしてください。（${message}）`;
  logout();
};

const {
  loading,
  error,
  filters,
  selectedTile,
  filteredTiles,
  categoryOptions,
  ageOptions,
  totalCount,
  completedCount,
  hasPrev,
  hasNext,
  loadTiles,
  createItem,
  updateItem,
  deleteItem,
  setFilter,
  clearFilters,
  openTile,
  closeTile,
  nextTile,
  prevTile,
  copyDone,
  copyTilesJson
} = useTiles(() => authParams.value, handleAuthError);

watch(
  isAuthenticated,
  (authenticated) => {
    if (authenticated) {
      authNotice.value = '';
      loadTiles();
    }
  },
  { immediate: true }
);

const categoryNames = computed(() => categoryOptions.value.map((option) => option.value));

const editorOpen = ref(false);
const editorItem = ref(null);
const editorSaving = ref(false);
const editorError = ref('');

const openAdd = () => {
  editorItem.value = null;
  editorError.value = '';
  editorOpen.value = true;
};

const openEdit = () => {
  editorItem.value = selectedTile.value;
  editorError.value = '';
  editorOpen.value = true;
  closeTile();
};

const closeEditor = () => {
  editorOpen.value = false;
  editorItem.value = null;
};

const saveEditor = async (payload) => {
  editorSaving.value = true;
  editorError.value = '';
  try {
    if (editorItem.value) {
      await updateItem(payload);
    } else {
      await createItem(payload);
    }
    closeEditor();
  } catch (err) {
    editorError.value = err instanceof Error ? err.message : '保存に失敗しました。';
  } finally {
    editorSaving.value = false;
  }
};

const deleteEditor = async (id) => {
  editorSaving.value = true;
  editorError.value = '';
  try {
    await deleteItem(id);
    closeEditor();
  } catch (err) {
    editorError.value = err instanceof Error ? err.message : '削除に失敗しました。';
  } finally {
    editorSaving.value = false;
  }
};
</script>

<style scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 clamp(16px, 4vw, 40px);
  height: 56px;
  background: color-mix(in srgb, var(--bg) 86%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.site-nav .brand {
  justify-self: start;
  font-family: "Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho", serif;
  font-weight: 700;
  font-size: 15px;
  color: var(--ink);
  letter-spacing: 0.04em;
  white-space: nowrap;
  text-decoration: none;
}

.site-nav ul {
  justify-self: center;
  display: flex;
  gap: clamp(14px, 3vw, 30px);
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-nav ul a {
  color: var(--ink-2);
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  text-decoration: none;
}

.site-nav ul a:hover {
  color: var(--accent);
}

@media (max-width: 560px) {
  .site-nav {
    grid-template-columns: 1fr;
  }

  .site-nav .brand {
    display: none;
  }

  .site-nav ul {
    justify-self: stretch;
    width: 100%;
    justify-content: space-between;
    gap: 6px;
  }

  .site-nav ul a {
    font-size: 12px;
    letter-spacing: 0.02em;
  }
}

.hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 300px;
  color: #fdfbf7;
  overflow: hidden;
  background: #241a12 url("https://freddiefujiwara.com/assets/hero-koinobori.jpg") center 38% / cover no-repeat;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(16, 11, 6, 0.88) 0%, rgba(16, 11, 6, 0.45) 45%, rgba(16, 11, 6, 0.15) 75%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 96px 20px 36px;
}

.hero-place {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.22em;
  font-weight: 700;
  margin: 0 0 14px;
}

.hero-place::before {
  content: "";
  width: 34px;
  height: 2px;
  background: #f0764f;
}

.hero h1 {
  margin: 0;
  font-family: "Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho", serif;
  font-weight: 800;
  letter-spacing: 0.03em;
  line-height: 1.35;
}

.h1-name {
  display: block;
  font-size: clamp(2rem, 6vw, 2.9rem);
}

.h1-role {
  display: block;
  font-size: clamp(1.05rem, 3.4vw, 1.45rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-top: 10px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

.stats {
  color: var(--ink-2);
  font-size: 0.95rem;
  margin: 0 0 16px;
}

.login-gate {
  padding: 32px 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  text-align: center;
}

.login-gate h2 {
  margin: 0 0 12px;
  font-family: "Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho", serif;
  font-size: 1.3rem;
}

.login-gate p {
  margin: 0 auto 16px;
  max-width: 560px;
  color: var(--ink-2);
  line-height: 1.8;
}

.auth-notice {
  color: var(--error) !important;
  font-weight: 600;
}

.google-button {
  display: flex;
  justify-content: center;
  min-height: 44px;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stats-row .stats {
  margin-bottom: 16px;
}

.add-btn {
  border: none;
  border-radius: 999px;
  padding: 9px 18px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  margin-bottom: 16px;
}

.state {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  text-align: center;
}

.error {
  color: var(--error);
  background: var(--error-bg);
}

.retry {
  display: block;
  margin: 12px auto 0;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.utility {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  font-size: 0.92rem;
}

.utility a {
  color: var(--ink-2);
  text-decoration: none;
}

.utility a:hover {
  color: var(--accent);
}

.utility .sep {
  color: var(--ink-3);
}

.copy-btn {
  border: none;
  background: none;
  color: var(--ink-2);
  font-size: 0.92rem;
  cursor: pointer;
  padding: 0;
}

.copy-btn:hover {
  color: var(--accent);
}

.copy-btn:disabled {
  cursor: wait;
  opacity: 0.7;
}

.copy-done {
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 600;
}

.site-footer {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.foot-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-bottom: 14px;
}

.foot-links a {
  color: var(--ink-2);
  text-decoration: none;
  font-size: 0.92rem;
}

.foot-links a:hover {
  color: var(--accent);
}

.site-footer .copy {
  color: var(--ink-2);
  font-size: 0.85rem;
  margin: 0;
}
</style>
