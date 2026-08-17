"""
Database seeding script — populates Supabase with constitutional articles and scenarios.
Run: python -m app.seed.seed_db
"""

import asyncio
import json
from pathlib import Path

from sqlalchemy import text

from app.core.database import engine, async_session_factory, Base
from app.models.article import ConstitutionalArticle, Topic
from app.models.scenario import Scenario


SEED_DIR = Path(__file__).parent


async def seed_topics(session):
    """Seed constitutional topics/categories."""
    topics = [
        {"topic_name_en": "Fundamental Rights", "topic_name_hi": "मौलिक अधिकार", "topic_category": "fundamental_rights", "description": "Rights guaranteed to all citizens under Part III (Articles 12-35)", "display_order": 1},
        {"topic_name_en": "Right to Property & Legal Rights", "topic_name_hi": "संपत्ति का अधिकार", "topic_category": "legal_rights", "description": "Constitutional and legal rights beyond fundamental rights", "display_order": 2},
        {"topic_name_en": "Directive Principles of State Policy", "topic_name_hi": "राज्य नीति के निदेशक सिद्धांत", "topic_category": "dpsp", "description": "Guidelines for the state in Part IV (Articles 36-51)", "display_order": 3},
        {"topic_name_en": "Emergency Provisions", "topic_name_hi": "आपातकालीन प्रावधान", "topic_category": "emergency", "description": "National, State, and Financial Emergency provisions", "display_order": 4},
        {"topic_name_en": "Constitutional Framework", "topic_name_hi": "संवैधानिक ढांचा", "topic_category": "framework", "description": "Preamble, Amendments, and structural provisions", "display_order": 5},
        {"topic_name_en": "Fundamental Duties", "topic_name_hi": "मौलिक कर्तव्य", "topic_category": "duties", "description": "Duties of citizens under Part IVA (Article 51A)", "display_order": 6},
    ]
    for topic_data in topics:
        topic = Topic(**topic_data)
        session.add(topic)
    await session.flush()
    print(f"  ✅ Seeded {len(topics)} topics")


async def seed_articles(session):
    """Seed constitutional articles from JSON."""
    articles_file = SEED_DIR / "articles.json"
    with open(articles_file, "r", encoding="utf-8") as f:
        articles_data = json.load(f)

    for article_data in articles_data:
        article = ConstitutionalArticle(**article_data)
        session.add(article)
    await session.flush()
    print(f"  ✅ Seeded {len(articles_data)} constitutional articles")


async def seed_scenarios(session):
    """Seed interactive scenarios from JSON."""
    scenarios_file = SEED_DIR / "scenarios.json"
    with open(scenarios_file, "r", encoding="utf-8") as f:
        scenarios_data = json.load(f)

    for scenario_data in scenarios_data:
        scenario = Scenario(**scenario_data)
        session.add(scenario)
    await session.flush()
    print(f"  ✅ Seeded {len(scenarios_data)} scenarios")


async def run_seed():
    """Main seed function — creates tables and populates data."""
    print("🌱 Starting database seed...")
    print()

    # Create all tables
    print("📋 Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("  ✅ Tables created")
    print()

    # Seed data
    async with async_session_factory() as session:
        try:
            # Check if data already exists
            result = await session.execute(
                text("SELECT COUNT(*) FROM constitutional_articles")
            )
            count = result.scalar()
            if count and count > 0:
                print(f"⚠️  Database already has {count} articles. Skipping seed.")
                print("   To re-seed, drop the tables first.")
                return

            print("📝 Seeding topics...")
            await seed_topics(session)

            print("📜 Seeding articles...")
            await seed_articles(session)

            print("🎭 Seeding scenarios...")
            await seed_scenarios(session)

            await session.commit()
            print()
            print("🎉 Database seeded successfully!")
        except Exception as e:
            await session.rollback()
            print(f"❌ Error seeding database: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(run_seed())
